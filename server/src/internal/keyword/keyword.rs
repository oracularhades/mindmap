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

sql_function! {
    fn group_concat(expr: Text) -> Text;
}

use crate::internal::keyword::metadata::keyword_metadata_get;

// TODO: Keyword_sql BOTH HERE AND IN KEYWORD_GET NEEDS TO BE CHANGED BECAUSE IT INCLUDES RAW DB INFORMATION.
pub async fn keyword_list(mut db: Connection<Db>, user_id: String, ids: Option<Vec<String>>) -> Result<(Vec<Rendered_keyword>, Option<Value>, Connection<Db>), String> {
    let sql: Config_sql = (&*SQL_TABLES).clone();

    let mut query = crate::tables::keywords::table
    .inner_join(keyword_metadata::table.on(crate::tables::keyword_metadata::id.eq(keywords::keyword_metadata)))
    .into_boxed();

    println!("ids: {:?}", ids.clone());

    if ids.is_none() == false && ids.clone().unwrap().len() > 0 {
        query = query.filter(keyword_metadata::id.eq_any(ids.clone().unwrap()));
    }

    let results: Vec<(Option<Keyword_metadata>, Option<String>)> = query
        .select((
            keyword_metadata::all_columns.nullable(),
            group_concat(crate::tables::keywords::keyword).nullable(),
        ))
        .order(keyword_metadata::created.desc())
        .load::<(
            Option<Keyword_metadata>,
            Option<String>
        )>(&mut db)
        .await
        .expect("Something went wrong querying the DB.");

    let mut item_results: Vec<Rendered_keyword> = Vec::new();
    for (metadata_wrapped, keywords) in results {
        if metadata_wrapped.is_none() == true || keywords.is_none() == true {
            continue;
        }

        let metadata = metadata_wrapped.unwrap();

        let keywords_vec: Vec<String> = keywords.unwrap().split(',')
            .map(|s| s.to_string())
            .collect();
    
        item_results.push(Rendered_keyword {
            id: metadata.id,
            owner: metadata.owner,
            description: metadata.description,
            external_link: metadata.external_link,
            image: metadata.image,
            external_image: metadata.external_image,
            item: metadata.item,
            created: metadata.created,
            keywords: Some(keywords_vec),
        });
    }

    // let item_results: Vec<Rendered_keyword> = results.into_iter().map(|(metadata, keywords)| {
    //     if (keywords.is_none() == true) {
    //         continue;
    //     }

    //     let keywords_vec: Vec<String> = keywords.split(',')
    //     .map(|s| s.to_string())
    //     .collect();
        
    //     Rendered_keyword {
    //         id: metadata.id,
    //         owner: metadata.owner,
    //         description: metadata.description,
    //         external_link: metadata.external_link,
    //         image: metadata.image,
    //         external_image: metadata.external_image,
    //         item: metadata.item,
    //         created: metadata.created,
    //         keywords: Some(keywords_vec),
    //     }
    // }).collect();

    return Ok((
        item_results,
        None,
        db
    ));
}

pub async fn keyword_get(mut db: Connection<Db>, id: String, write_authorized: Option<String>) -> Result<(Option<Keyword_sql>, Option<Value>, Connection<Db>), String> {
    let sql: Config_sql = (&*SQL_TABLES).clone();

    let keyword_table = sql.keyword.unwrap();
    let keyword_metadata = sql.keyword_metadata.unwrap();

    // TODO: Keywords shouldn't have owners (and keyword_metadata and keyword join might be the wrong way around??)
    let selection = format!("SELECT keyword_metadata.id AS id, GROUP_CONCAT(keyword.keyword) AS keywords, keyword_metadata.description, keyword_metadata.image, keyword_metadata.external_image, keyword_metadata.external_link, keyword_metadata.owner, keyword_metadata.created
FROM {}
INNER JOIN {}
ON keyword.owner = keyword_metadata.owner", keyword_table.clone(), keyword_metadata.clone());

    let mut results: Vec<Keyword_sql> = Vec::new();

    results = sql_query(&format!("{} WHERE keyword_metadata.id=?", selection))
    .bind::<Text, _>(id.clone())
    .load::<Keyword_sql>(&mut db)
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