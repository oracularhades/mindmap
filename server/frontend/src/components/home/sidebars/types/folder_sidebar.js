import { useEffect, useRef, useState } from "react";
import '@/components/global.css';
import './css/folder_sidebar.css';
import { Journal } from "@oracularhades/journal";
import { creds } from "@/global";
import Mindmap_folder from "@/components/internal_components/mindmap/button/mindmap_folder";
import Mindmap_item from "@/components/internal_components/mindmap/button/mindmap_item";
import LoadingSpinner from "@/components/miscellaneous/loadingspinner";
import Link from "next/link";

export default function Sidebar_Folders(props) {
    if (props.sidebar_state && props.sidebar_state != "folders") {
        return;
    }

    const [loading, set_loading] = useState(true);
    const [data, set_data] = useState(null);
    const [folder, set_folder] = useState(null);
    const [folders_and_items, set_folders_and_items] = useState([]);

    const [search_query, set_search_query] = useState(null);
    const [folder_navigation_log, set_folder_navigation_log] = useState([]);

    async function folder_list(folder_id) {
        set_loading(true);
        
        let response = null;
        try {
            response = await Journal(creds()).item.list({ folder: folder_id });
        } catch (error) {
            alert(error.message);
            throw error;
        }

        set_data(response);
        set_folder(response.folder);
        set_folders_and_items(response.data);
        set_loading(false);

        if (props.folder_change) {
            props.folder_change(folder_id);
        }
    }

    function refresh_current_folder() {
        console.log("refresh_current_folder: I am refreshing.");

        let folder_id = null;
        if (folder && folder.id) {
            folder_id = folder.id;
        }

        folder_list(folder_id);
    }

    const should_run = useRef(true);
    useEffect(() => {
        if (props.set_folder_list) {
            props.set_folder_list.current = refresh_current_folder;
        }

        if (should_run.current != true) { return; }
        should_run.current = false;

        const params = new URLSearchParams(window.location.search);

        folder_list(params.get("folder") ? params.get("folder") : null);
    });

    function folder_select(folder_id) {
        // Get new folder.
        
        if (folder && folder.id) {
            log_folder(folder.id);
        } else {
            log_folder(null);
        }
        
        folder_list(folder_id);
    }

    function log_folder(folder_id) {
        let folder_log = folder_navigation_log;
        folder_log.push(folder_id);
        set_folder_navigation_log(folder_log);
    }

    function folder_back() {
        // This is the position of the folder-id value in the array.
        let last_folder_position = folder_navigation_log.length-1;

        // This value is the ID of the folder in the array.
        let last_folder = folder_navigation_log[last_folder_position];

        let new_folder_nav = folder_navigation_log;

        // Remove this folder from the nav log, since we're navigating to it.
        new_folder_nav.pop();

        // Update the navigation log.
        set_folder_navigation_log(new_folder_nav);

        // Setup the folder we're navigating back to.
        folder_list(last_folder);
    }

    const folders_ul = folders_and_items.map((mindmap) => {
        if (mindmap.type == "folder") {
            return (
                <Mindmap_folder data={mindmap} onSelect={folder_select}/>
            )
        } else if (mindmap.type == "item") {
            return (
                <Mindmap_item data={mindmap}/>
            )
        }
    });

    let title = folder && folder.title ? folder.title : "all";

    return (
        <div className="sidebar2_folders" style={props.style}>
            {folder && <div className="folder_metadata">
                <div className='left'>
                    <img className="back_arrow hover" src="/icons/arrow-left-solid.svg" onClick={() => { folder_back(); }}/>
                    <p className="title">{title}</p>
                </div>

                <div className='right'>
                    <Link href={`/import?${new URLSearchParams({ folder: folder.id }).toString()}`}><button className='import'><img src="/icons/import.svg"/></button></Link>
                </div>
            </div>}
            <input className="sidebar2_search" placeholder={`Search '${title}'`} value={search_query} onChange={(e) => { set_search_query(e.target.value); }}/>
            <div className="sidebar2_inner_content">
                {search_query && search_query.length > 0 && <p className="results_for greyText">Results for "{search_query}"</p>}
                <div className={`sidebar2_mindmap_content ${loading == true || folders_and_items.length == 0 ? 'center_loading_spinner' : ''}`}>
                    {loading == false && folders_ul}
                    {loading == false && folders_and_items.length == 0 && <p>No results</p>}
                    {loading == true && folders_and_items.length > 0 && <LoadingSpinner speed="600ms" style={{ width: 12, alignSelf: "center", justifySelf: "center" }}/>}
                </div>
            </div>
        </div>
    )
};