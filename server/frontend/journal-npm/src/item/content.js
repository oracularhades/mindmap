import { Journal, getCreds } from "../index.js";
import { getRoverApiURL } from "../routing.js";
import general from "../general.js";

async function list(data) {
    const request = await Journal(await getCreds()).fetch_wrapper(`${getRoverApiURL()}/item/content/list?${general().objectToParams(data)}`, {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'default', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: 'error', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    })
    
    const response = request.json();
    
    return response;
}

async function update(action, actions) {
    const request = await Journal(await getCreds()).fetch_wrapper(`${getRoverApiURL()}/item/content/update`, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'default', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        redirect: 'error', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            action: action,
            actions: actions
        })
    })
    
    const response = request.json();
    
    return response;
}

const item_content = { list, update };
export default item_content;