import fetch_wrapper from "./fetcher.js";
import general from "./general.js";
import user from "./user.js";
import folder from "./folder.js";
import item from './item.js';

let deviceIDG = null;
let privateKeyG = null;
let typeG = null;
let additional_data = null;

async function getCreds() {
    const pemHeader = "-----BEGIN PRIVATE KEY-----";
    const pemFooter = "-----END PRIVATE KEY-----";

    return {
        device_id: deviceIDG,
        private_key: pemHeader+privateKeyG+pemFooter,
        additional_data: additional_data,
        type: typeG
    };
}

function Journal(credsObject) {
    if (credsObject) {
        deviceIDG = credsObject.device_id;
        privateKeyG = credsObject.private_key;
        additional_data = credsObject.additional_data;
        typeG = credsObject.type;
    } else {
        console.warn("You need to specify a credentials object when initalizing Rover(). E.g Rover({ deviceID \"myawesomedeviceid\", \"privatekey\":\"awesomeprivatekey\"})");
    }

    return {
        fetch_wrapper: fetch_wrapper,
        general: general,
        user: user,
        folder: folder,
        item: item
    };
}

export { Journal, getCreds }