use rocket::serde::{Serialize, Deserialize, json::Json};
use rocket::serde::json::{Value, json};
use rocket::response::{status, status::Custom};
use rocket::http::Status;

use rocket_db_pools::{Database, Connection};
use rocket_db_pools::diesel::{MysqlPool, prelude::*};
use diesel::sql_query;
use diesel::sql_types::*;

use crate::global::{generate_random_id, get_epoch, is_null_or_whitespace, request_authentication};
use crate::responses::*;
use crate::structs::*;
use crate::tables::*;
use crate::SQL_TABLES;

use crate::internal::keyword::metadata::keyword_metadata_get;

pub async fn keyword_list(mut db: Connection<Db>, user_id: String, keyword_metadata: Option<String>) -> Result<(Vec<Mindmap_item>, Option<Value>, Connection<Db>), String> {
    let sql: Config_sql = (&*SQL_TABLES).clone();

    let keyword_table = sql.keyword.unwrap();

    let selection = format!("SELECT keyword, owner, item, created, keyword_metadata FROM {}", keyword_table.clone());

    let mut item_results: Vec<Mindmap_item> = Vec::new();
    if (is_null_or_whitespace(keyword_metadata.clone()) == false) {
        // Check we have permission to access the keyword metadata.

        // TODO: I wrote this while very tired, check keyword/*, because I wrote all that. Check Github history as well.
        let keyword_metadata_id = keyword_metadata.unwrap();
        let (keyword_metadata_status, error_to_respond_with, keyword_db) = keyword_metadata_get(db, keyword_metadata_id.clone(), Some(user_id.clone())).await.expect("Error looking up keyword_metadata.");
        db = keyword_db;

        if (error_to_respond_with.is_none() == false) {
            return Ok((Vec::new(), Some(error_to_respond_with.unwrap()), db));
        }
        if (keyword_metadata_status.is_none() == true) {
            return Ok((Vec::new(), Some(error_message("params.keyword_metadata was not found, or you are not authorized to access it.")), db));
        }

        item_results = sql_query(&format!("{} WHERE owner=? AND keyword_metadata=? ORDER BY created DESC", selection))
        .bind::<Text, _>(user_id.clone())
        .bind::<Nullable<Text>, _>(keyword_metadata_id.clone())
        .load::<Mindmap_item>(&mut db)
        .await
        .expect("Something went wrong querying the DB.");
    } else {
        item_results = sql_query(&format!("{} WHERE owner=? ORDER BY created DESC", selection))
        .bind::<Text, _>(user_id.clone())
        .load::<Mindmap_item>(&mut db)
        .await
        .expect("Something went wrong querying the DB.");
    }
    
    return Ok((
        item_results,
        None,
        db
    ));
}

pub async fn keyword_get(mut db: Connection<Db>, id: String, write_authorized: Option<String>) -> Result<(Option<Mindmap_item>, Option<Value>, Connection<Db>), String> {
    let sql: Config_sql = (&*SQL_TABLES).clone();

    let results: Vec<Mindmap_item> = sql_query(format!("SELECT keyword, owner, item, created, keyword FROM {} WHERE id=? AND owner=? ORDER BY created DESC", sql.item.unwrap()))
    .bind::<Text, _>(id.clone())
    .bind::<Text, _>(write_authorized.clone().unwrap()) // temp until permissions system
    .load::<Mindmap_item,>(&mut db)
    .await
    .expect("Something went wrong querying the DB.");

    if (results.len() == 0) {
        // Not found.
        return Ok((None, None, db));
    }

    let result = results[0].clone();

    if (write_authorized.is_none() == false) {
        if (result.owner.clone().unwrap() != write_authorized.unwrap()) {
            // We found a result, but the user doesn't have write access. [Currently we're just checking if they're the owner until there is a better system]
            return Ok((None, Some(error_message("You need write authorization for the specified folder.")), db));
        }
    }

    return Ok((
        Some(result),
        None,
        db
    ));
}