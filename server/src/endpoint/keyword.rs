use rocket::serde::{Serialize, Deserialize, json::Json};
use rocket::serde::json::{Value, json};
use rocket::response::{status, status::Custom};
use rocket::http::Status;

use rocket_db_pools::{Database, Connection};
use rocket_db_pools::diesel::{MysqlPool, prelude::*};

use crate::global::request_authentication;
use crate::responses::*;
use crate::structs::*;
use crate::tables::*;

// TODO: none of this, none of it, is finished.

#[get("/keyword/list")]
pub async fn keyword_list(mut db: Connection<Db>, params: &Query_string) -> Custom<Value> {
    let request_authentication_output: Request_authentication_output = match request_authentication(db, None, params, "/process/list", false).await {
        Ok(data) => data,
        Err(e) => return status::Custom(Status::Unauthorized, not_authorized())
    };
    db = request_authentication_output.returned_connection;

    let results = rover_processes::table
        // .filter(rover_network::location.eq("onboard_client"))
        .select(Rover_processes::as_select())
        .load(&mut db)
        .await.expect("Query failed");

    let mut item_result_public: Vec<Mindmap_item_public> = item_result
        .into_iter()
        .map(Mindmap_item_public::from)
        .collect();

    status::Custom(Status::Ok, json!({
        "ok": true,
        "data": results
    }))
}

#[post("/update", format = "application/json", data = "<body>")]
pub async fn keyword_update(mut db: Connection<Db>, params: &Query_string, mut body: Json<Folder_update_body>) -> Custom<Value> {
    let sql: Config_sql = (&*SQL_TABLES).clone();
    
    let request_authentication_output: Request_authentication_output = match request_authentication(db, None, params, "/folder/update", false).await {
        Ok(data) => data,
        Err(e) => return status::Custom(Status::Unauthorized, not_authorized())
    };
    db = request_authentication_output.returned_connection;

    // TODO: There should be an action logic pipeline.
    
    // Normallly it would matter what the value of unwrap_or was here, since we're trying to check the original value, in this case checking if it's None, but it doesn't matter here because there is a check for 'create' or 'update'.
    let action = body.action.clone().unwrap_or(String::new());
    if (action != "create" && action != "update") {
        return status::Custom(Status::BadRequest, error_message("body.action must be create/update."));
    }
    if (action == "update" && body.id.is_none() == true) {
        return status::Custom(Status::BadRequest, error_message("body.id must be specified when body.action='update'"));
    }
    if (action == "create" && body.id.is_none() == false) {
        return status::Custom(Status::BadRequest, error_message("body.id cannot be specified when body.action='create'"));
    }

    // We don't care if body.description is provided, it's not required, but we do want to check the length.
    let description = body.description.clone();
    if (description.is_none() == false && description.len() > 200000) {
        return status::Custom(Status::BadRequest, error_message("body.description cannot be more than 200000 characters."));
    }
    
    // We don't care if body.description is provided, it's not required, but we do want to check the length.
    let information_link = body.information_link.clone();
    if (information_link.is_none() == false && information_link.len() > 200000) {
        return status::Custom(Status::BadRequest, error_message("body.description cannot be more than 200000 characters."));
    }

    // TODO: Ensure keyword has no spaces, and is correctly formatted, with a length limit.
    if (body.keywords.is_none() == true) {
        return status::Custom(Status::BadRequest, error_message("body.keywords is null or whitespace."));
    }
    if (body.keywords.len() == 0) {
        return status::Custom(Status::BadRequest, error_message("body.keywords exists but has no items. You must provide at least 1 keyword."));
    }
    let keywords = body.keywords.clone();

    let mut keyword_metadata = generate_random_id();
    // let number: i32 = rand::thread_rng().gen_range(0..999999);

    if (action == "update") {
        // We know 'body.id' exists, because we checked when validating the 'body.action'.
        folder_id = body.id.clone().unwrap(); 

        let (folder, error_to_respond_with, folder_db) = folder_get(db, folder_id.clone(), Some(request_authentication_output.user_id.clone())).await.expect("Failed to get folder.");  
        db = folder_db;

        if (folder.is_none() == true) {
            return status::Custom(Status::BadRequest, error_message(&format!("Folder does not exist: '{}'", folder_id.clone())));
        }

        let result: Vec<Mindmap_folder> = sql_query(&format!("UPDATE {} SET title=?, folder=?, visibility=? WHERE id=? AND owner=?", sql.folder.unwrap()))
        .bind::<Text, _>(title.clone())
        .bind::<Nullable<Text>, _>(inner_folder.clone())
        .bind::<Text, _>(visibility.clone())
        .bind::<Text, _>(folder_id.clone())
        .bind::<Text, _>(request_authentication_output.user_id.clone())
        .load::<Mindmap_folder>(&mut db)
        .await
        .expect("Something went wrong querying the DB.");
    } else if (action == "create") {
        let result: Vec<Mindmap_folder> = sql_query(&format!("INSERT INTO {} (id, title, folder, visibility, owner, created) VALUES (?, ?, ?, ?, ?, ?)", sql.folder.unwrap()))
        .bind::<Text, _>(folder_id.clone())
        .bind::<Text, _>(title.clone())
        .bind::<Nullable<Text>, _>(inner_folder.clone())
        .bind::<Text, _>(visibility.clone())
        .bind::<Text, _>(request_authentication_output.user_id.clone())
        .bind::<BigInt, _>(get_epoch())
        .load::<Mindmap_folder>(&mut db)
        .await
        .expect("Something went wrong querying the DB.");
    }

    return status::Custom(Status::Ok, json!({
        "ok": true,
        "folder_id": folder_id.clone()
    }));
}