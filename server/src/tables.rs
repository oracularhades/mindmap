use rocket::serde::{Serialize, Deserialize};
use diesel::prelude::*;
use diesel::sql_types::*;
use crate::structs::*;
use rocket_db_pools::{Database, Connection};
use rocket_db_pools::diesel::{MysqlPool, prelude::*};

diesel::table! {
    posts (id) {
        id -> Nullable<BigInt>,
        title -> Text,
        text -> Text,
        published -> Bool,
    }
}
diesel::table! {
    user (id) {
        id -> Text,
        first_name -> Nullable<Text>,
        last_name -> Nullable<Text>,
        email -> Nullable<Text>,
        permission -> Nullable<BigInt>,
    }
}

diesel::table! {
    magiclink (code) {
        attempt_id -> Text,
        code -> Nullable<BigInt>,
        created -> Nullable<BigInt>,
        attempts -> Nullable<BigInt>,
        user_id -> Text,
    }
}

diesel::table! {
    device (id) {
        id -> Text,
        user_id -> Text,
        public_key -> Text,
        created -> Nullable<BigInt>,
        active -> Nullable<Bool>,
        alias -> Nullable<Text>
    }
}

diesel::table! {
    mindmap_folder (id) {
        id -> Text,
        title -> Nullable<Text>,
        owner -> Nullable<Text>,
        created -> Nullable<BigInt>,
        visibility -> Nullable<Text>,
    }
}

diesel::table! {
    mindmap_item (id) {
        id -> Text,
        title -> Nullable<Text>,
        folder -> Nullable<Text>,
        owner -> Nullable<Text>,
        created -> Nullable<BigInt>,
        visibility -> Nullable<Text>,
    }
}

diesel::table! {
    rover_processes (device_id) {
        device_id -> Text,
        process -> Text,
        last_seen ->  Nullable<BigInt>,
        user -> Text,
        admin_user -> Text,
        is_admin_process -> Text,
        PID -> Nullable<BigInt>,
        publisher -> Text,
        hash -> Text,
        threads ->  Nullable<BigInt>,
        size ->  Nullable<BigInt>,
        pathname -> Text,
    }
}