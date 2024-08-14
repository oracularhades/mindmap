import './css/import.css';
import "@/../styles/global.css";
import "@/components/global.css";
import Home1 from "@/components/home/home";
import { useEffect, useRef, useState } from "react";
import { build_nested_structure, create_item, creds, get_file_content } from '@/global';
import Waterfall from '@/components/internal_components/mindmap/waterfall/waterfall';
import Input_with_header from '@/components/input/input_with_header';
import { Journal } from '@oracularhades/journal';
import { useRouter } from 'next/router';
import Button1 from '@/components/internal_components/button/button';

export default function Import() {
    const router = useRouter();
    const should_run = useRef(true);
    const [data, set_data] = useState([]);
    const [title, set_title] = useState(null);

    const file = useRef(null);

    useEffect(() => {
        if (should_run.current != true || !router.query.id) { return; }
        should_run.current = false;

        // get_keywords();
    });

    async function things(item) {
        const content = await get_file_content(file.current);

        let new_content = [];
        let last_id = -1;
        let rank = -1;
        let child_rank = -1;

        let next_is_child = false;
        let last_child_id = null;

        let child_identifier = null;

        content[0].replaceAll("\r", "").split("\n").map((element) => {
            if (element.trim().length == 0) {
                next_is_child = false;
                return;
            }

            let child_id = null;
            let parent = null;

            let is_child = false;

            function child_processing(identifier) {
                // if (is_child == true && child_identifier != identifier) {
                //     console.log(`FIRING: ${child_identifier} != ${identifier}`)
                //     child_id = last_child_id+"-"+child_id;
                //     parent = last_child_id;
                //     child_rank = -1;
                // } else {
                    is_child = true;
                    child_id = `${last_id}-${child_rank}`;
                    parent = last_id;
                    // child_identifier = identifier;
                // }

                last_child_id = child_id;
            }

            let identifier = null;
            if (element.startsWith("* ")) {
                identifier = "* ";

                child_processing(identifier);
                element = element.replace("* ", "");
            } else if (element.startsWith("==> ")) {
                identifier = "==> ";

                child_processing(identifier);
                element = element.replace("==> ", "");
            } else if (next_is_child == true) {
                child_processing(":");
            }

            if (element.startsWith("o ")) {
                element = element.replace("o ", "");
            }

            let template = {
                action: "create",
                content: element,
                item: item
            };

            let prepend = `${item}_`;

            if (is_child == true) {
                child_rank++;

                new_content.push({ ...template, row_id: prepend+child_id.toString(), parent: prepend+parent.toString(), rank: child_rank });   
            } else {
                // Reset child rank, we've finished that section, it's irrelevant.
                child_rank = -1;

                last_id++;
                rank++;

                next_is_child = false;

                if (element.endsWith(":")) {
                    next_is_child = true;
                }

                new_content.push({ ...template, row_id: prepend+last_id.toString(), parent: null, rank: rank });   
            }
        });

        set_title(new_content[0].content);
        set_data(new_content);
        
        return new_content;
    }

    async function import_document() {
        const params = new URLSearchParams(window.location.search);

        const data = {
            action: "create",
            title: title,
            visibility: "private",
            folder: params.get("folder")
        }

        try {
            const item_response = await Journal(creds()).item.update(data);
            let new_data = await things(item_response.item_id);

            await Journal(creds()).item.content.update("create", new_data);

            alert("Imported successfully");
            reset();
        } catch (error) {
            alert(error.message);
            throw error;
        }
    }

    async function reset() {
        set_title(null);
        set_data([]);
        file.current = null;
    }

    return (
        <Home1 className="keywords_page home_padding">
            <div className="top">
                <h1>Import</h1>
            </div>

            <div className='import_inner'>
                <label className='file_net hover' for="video_upload">
                    <p className='greyText'>Select File</p>
                </label>
                <input id="video_upload" type="file" accept=".txt" onChange={(e) => { file.current = e.target.files[0]; things(null); }} style={{ visibility: "collapse" }}/>

                {data.length > 0 && <div className='import_inner_preview'>
                    <Input_with_header header="Title" value={title} onChange={(e) => { set_title(e.target.value); }}/>

                    <p>Preview</p>
                    <Waterfall data={build_nested_structure(data)}/>
                    <Button1 onClick={import_document}>Import</Button1>
                </div>}
            </div>
        </Home1>
    )
}