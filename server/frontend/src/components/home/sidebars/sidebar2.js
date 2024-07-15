import "./css/sidebar2.css";
import { useEffect, useRef, useState } from "react";
import ProfilePic from "@/components/user/profile_pic";
import UserCard1 from "@/components/user/user_cards/user_card1";
import Dialog_create_mindmap from "@/components/internal_components/mindmap/dialog/create_mindmap";
import Dialog_create_folder from "@/components/internal_components/mindmap/dialog/create_folder";
import Sidebar_Folders from "./types/folder_sidebar";

export default function Sidebar2(props) {
    const [folder, set_folder] = useState(null); // folder should be set by folder_change via props in <Sidebar_Folders/>
    const folder_list_trigger = useRef(null);
    const should_run = useRef(true);

    function folder_change(folder_id) {
        set_folder(folder_id);
    }

    useEffect(() => {
        if (should_run.current != true || folder) { return; }
        should_run.current = false;

        // let params = new URLSearchParams(window.location.search);
        // set_folder(params.get("folder"));
    });

    return (
        <div className="sidebar2">
            <Dialog_create_mindmap folder={folder} on_success={() => { if (folder_list_trigger.current) { let function_v = folder_list_trigger.current; function_v(); } }}/>
            <Dialog_create_folder folder={folder} on_success={() => { if (folder_list_trigger.current) { let function_v = folder_list_trigger.current; function_v(); } }}/>
            <div className="sidebar2_topbar">
                <ProfilePic hover={<UserCard1 user={{ name: "Example user", email: "user@example.com" }}>
                    <button>Logout</button>
                </UserCard1>}/>
                <div className="sidebar2_topbar_right_buttons">
                    <img style={{ width: 20, height: 20, padding: 2 }} src="/icons/words.svg" className="hover" onClick={() => { document.getElementById("dialog_create_mindmap").showModal(); }}/>
                    <img style={{ width: 20, height: 20, padding: 2 }} src="/icons/folder-create.svg" className="hover" onClick={() => { document.getElementById("dialog_create_folder").showModal(); }}/>
                    <img style={{ width: 20, height: 20, padding: 2 }} src="/icons/plus-solid.svg" className="hover" onClick={() => { document.getElementById("dialog_create_mindmap").showModal(); }}/>
                </div>
            </div>

            <div className="sidebar2_sidebars_holder">
                <Sidebar_Folders folder_change={folder_change} set_folder_list={folder_list_trigger}/>
                {/* <Sidebar_Items folder={folder} sidebar_state={sidebar_state} set_sidebar_state={set_sidebar_state} style={(sidebar_state == "items") ? null : hidden_sidebar}/> */}
            </div>
        </div>
    )
}