import './css/create_folder.css';
import { example_mindmaps_array } from '@/components/global.js';
import Dialog_Frame from '../../../dialogs/dialog_frame.js';
import Input_with_header from '@/components/input/input_with_header.js';
import Input_row_header from '@/components/input/input_row_header.js';
import { useState } from 'react';
import { Journal } from '@oracularhades/journal';
import { creds } from '@/global';
import Button1 from '../../button/button';

function generate_random_mindmap_name() {
    const example_mindmaps_arrays = example_mindmaps_array();
    
    const section = example_mindmaps_arrays[Math.floor(Math.random() * example_mindmaps_arrays.length-1)];
    if (!section) {
        return "Failed to generate example";
    }
    let output = `${section.title}`;

    // output = `${output} - ${section.topics[Math.floor(Math.random() * section.topics.length-1)]}`;

    return output;
}

export default function Dialog_create_folder(props) {
    let default_visibility = "private";

    const [folder_name, set_folder_name] = useState(null);
    const [visibility, set_visibility] = useState(default_visibility);

    async function create_folder() {
        let data = {
            action: "create",
            title: folder_name,
            visibility: visibility,
            inner_folder: props.folder
        }

        try {
            await Journal(creds()).folder.update(data);
        } catch (error) {
            alert(error.message);
            throw error;
        }

        set_folder_name("");
        set_visibility(default_visibility);

        document.getElementById("dialog_create_folder").close();

        if (props.on_success) {
            props.on_success();
        }
    }

    return (
        <Dialog_Frame header="Create Folder" id="dialog_create_folder" className="dialog_create_folder">
            <Input_with_header header="Name" placeholder={generate_random_mindmap_name()} value={folder_name} onChange={(e) => { set_folder_name(e.target.value); }}/>

            <Input_row_header header="Visibility">
                <select value={visibility} onChange={(e) => { set_visibility(e.target.value); }}>
                    <option value="public">Public</option>
                    <option value="unlisted">Unlisted</option>
                    <option value="private">Private</option>
                </select>
            </Input_row_header>

            <Button1 onClick={() => {create_folder}}>Submit</Button1>
        </Dialog_Frame>
    )
}