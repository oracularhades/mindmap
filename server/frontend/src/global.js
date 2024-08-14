import { Journal } from "@oracularhades/journal";

function to_table(data) {
    let table_export = [];
    data.forEach((data) => {
        let keys_to_push = [];
        
        Object.keys(data).map((key) => {
            keys_to_push.push(key);
        });

        let not_found_keys = [];
        Object.keys(table_export).map((key) => {
            if (!data[key]) {
                not_found_keys.push(key);
            }
        });
        
        keys_to_push.forEach((key) => {
            if (!table_export[key]) {
                table_export[key] = [];
            }

            if (data[key]) {
                table_export[key].push(data[key]);
            } else {
                table_export[key].push("data[key]");
            }
        })

        not_found_keys.forEach((key) => {
            if (!table_export[key]) {
                table_export[key] = [];
            }
            
            table_export[key].push("null");
        });
    });

    return table_export;
}

async function redirect_to_login_if_required() {
    if (!await localStorage.getItem("auth")) {
        let host = window.location.hostname;
        if (window.location.port != 443 && window.location.port != 80) {
            host = `${host}:${window.location.port}`;
        }
        
        let params = new URLSearchParams({
            redirect: `${window.location.protocol}//${host}`
        });

        window.location.href = `/guard/frontend/login?${params.toString()}`;
    }
}

function creds() {
    const auth = JSON.parse(localStorage.getItem("auth"));
    return auth;
}

function UrlThroughParser(rawurl) {
    try {
        const urlData = new URL(rawurl);
        const params = new URLSearchParams(urlData.search);
        const queryString = params.toString();

        let queryStringOutput = "";
        if (queryString.length > 0) {
            queryStringOutput = "?"+queryString;
        }

        return `https://${urlData.host}${urlData.pathname}${queryStringOutput}`;
    } catch (error) {
        return null;
    }
}

async function get_file_content(file) {
    const file_promises = [0].map(() => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (async (e) => {
                resolve(e.target.result);
            });
            
            reader.onerror = (error) => {
                reject(error);
            };

            reader.readAsText(file);
        });
    });

    const file_responses = await Promise.all(file_promises);
    return file_responses;
}

function build_nested_structure(items) {
    const itemMap = {};

    // Create a map of items by their id
    items.forEach(item => {
        // Initialize each item with an empty `into` array
        itemMap[item.row_id] = { ...item, into: [] };
    });

    // Build the nested structure
    const result = [];
    items.forEach(item => {
        try {
            if (item.parent) {
                // Add this item directly to the parent's `into` array
                itemMap[item.parent].into.push(itemMap[item.row_id]);
            } else {
                // If no parent, this is a top-level item, wrapped in its own array
                result.push([itemMap[item.row_id]]);
            }
        } catch (error) {
            console.log(items.indexOf(item), `parent:`, item.parent, `row_id:`, item.row_id, `| error `, error, `| thing itemMap `, itemMap);
            throw error;
        }
    });

    return result;
}

async function create_item(parent, rank, item_id, content) {
    const data = {
        action: "create",
        parent,
        rank,
        item: item_id,
        content
    };
    
    try {
        await Journal(creds()).item.content.update("create", [data]);
    } catch (error) {
        alert(error.message);
        throw error;
    }
}

async function update_item(row_id, parent, rank, item, content) {
    const data = {
        action: "update",
        row_id,
        parent,
        rank,
        item: item_id,
        content
    };

    try {
        await Journal(creds()).item.content.update("update", [data]);
    } catch (error) {
        alert(error.message);
        throw error;
    }
}

export { to_table, redirect_to_login_if_required, creds, UrlThroughParser, get_file_content, build_nested_structure, create_item, update_item };