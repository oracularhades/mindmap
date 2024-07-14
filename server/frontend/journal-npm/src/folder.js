import { Journal, getCreds } from "./index.js";
import { getRoverApiURL } from "./routing.js";
import general from "./general.js";

async function list(query) {
    const request = await Journal(await getCreds()).fetch_wrapper(`${getRoverApiURL()}/folder/list?${general().objectToParams({ query })}`, {
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

async function update(data) {
    const request = await Journal(await getCreds()).fetch_wrapper(`${getRoverApiURL()}/folder/update`, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'default', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        redirect: 'error', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    
    const response = request.json();
    
    return response;
}

const folder = { list, update };
export default folder;