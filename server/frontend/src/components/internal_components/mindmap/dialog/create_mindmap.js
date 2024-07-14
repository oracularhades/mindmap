import './css/create_mindmap.css';
import { example_mindmaps_array } from '@/components/global.js';
import Dialog_Frame from '../../../dialogs/dialog_frame.js';
import Input_with_header from '@/components/input/input_with_header.js';
import Input_row_header from '@/components/input/input_row_header.js';
import { useState } from 'react';
import { Journal } from '@oracularhades/journal';
import { creds } from '@/global';

function generate_random_mindmap_name() {
    const example_mindmaps_arrays = example_mindmaps_array();
    
    const section = example_mindmaps_arrays[Math.floor(Math.random() * example_mindmaps_arrays.length-1)];
    if (!section) {
        return "Failed to generate example";
    }
    let output = `${section.title}`;

    output = `${output} - ${section.topics[Math.floor(Math.random() * section.topics.length-1)]}`;

    return output;
}

export default function Dialog_create_mindmap(props) {
    let default_visibility = "private";

    const [folder_name, set_folder_name] = useState(null);
    const [visibility, set_visibility] = useState(default_visibility);

    async function create_item() {
        let data = {
            action: "create",
            title: folder_name,
            visibility: visibility,
            folder: props.folder
        }

        await Journal(creds()).item.update(data);

        set_folder_name("");
        set_visibility(default_visibility);

        document.getElementById("dialog_create_mindmap").close();

        if (props.on_success) {
            props.on_success();
        }
    }

    return (
        <Dialog_Frame header="Create Mindmap" id="dialog_create_mindmap" className="dialog_create_mindmap">
            <Input_with_header header="Name" placeholder={generate_random_mindmap_name()} value={folder_name} onChange={(e) => { set_folder_name(e.target.value); }}/>

            <Input_row_header header="Visibility">
                <select value={visibility} onChange={(e) => { set_visibility(e.target.value); }}>
                    <option>Public</option>
                    <option>Unlisted</option>
                    <option>Private</option>
                </select>
            </Input_row_header>

            <button onClick={() => { create_item(); }}>Submit</button>
        </Dialog_Frame>
    )
}