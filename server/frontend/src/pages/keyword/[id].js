import './css/keyword.css';
import "@/../styles/global.css";
import "@/components/global.css";
import Home1 from "@/components/home/home";
import { useEffect, useRef, useState } from "react";
import Backdrop_content from '@/components/rows/backdrop/backdrop_content';
import Input_with_header from '@/components/input/input_with_header';
import Selector1 from '@/components/media/selectors/selector1';
import { Journal } from '@oracularhades/journal';
import Rows_backdrop_row1 from '@/components/rows/backdrop/rows/rows-backdrop-row1';
import { creds } from '@/global';
import { useRouter } from 'next/router';
import Button1 from '@/components/internal_components/button/button';
import Loading from '@/components/navigating/in-progress/loading';

export default function Keywords() {
    const router = useRouter();

    const should_run = useRef(true);
    const [loading, set_loading] = useState(true);

    const [keywords, set_keywords] = useState({ nonce: 0, data: [] });
    const [keyword_actions, set_keyword_actions] = useState({ nonce: 0, data: [] });

    const [description, set_description] = useState(null);
    const [external_link, set_external_link] = useState(null);
    const [external_image, set_external_image] = useState(null);
    const [image, set_image] = useState(null);

    const [id, set_id] = useState(null);

    useEffect(() => {
        if (should_run.current == router.query.id || !router.query.id) { return; }
        should_run.current = router.query.id;

        set_id(router.query.id);
        
        if (router.query.id != "create") {
            keyword_get(router.query.id);
        }

        if (router.query.id == "create") {
            set_loading(false);
        }
    });

    async function keyword_get(id) {
        try {
            set_loading(true);
            const response = await Journal(creds()).keyword.list({ ids: [ id ] });
            const data = response.data[0];
            if (!data) {
                alert("404"); // TODO: temp until actual 404 message.
                return;
            }

            set_description(data.description);
            set_external_link(data.external_link);
            set_image(data.image);
            set_external_image(data.external_image);
            set_keywords_state(data.keywords);
            set_loading(false);
        } catch (error) {
            alert(error.message);
            throw error;
        }
    }

    async function keyword_update() {
        try {
            const action = id == "create" ? "create" : "update";
            const output_id = action != "create" ? id : null;
            
            const body = {
                action: action,
                id: output_id,
                description: description,
                external_link: external_link,
                image: image,
                external_image: external_image,
                keywords: keyword_actions.data
            };

            const response = await Journal(creds()).keyword.update([ body ]);
        } catch (error) {
            alert(error.message);
            throw error;
        }
    }

    async function set_keywords_state(keywords) {
        set_keywords({ nonce: new Date().getTime(), data: keywords });
    }

    async function set_keyword_actions_state(actions) {
        set_keyword_actions({ nonce: new Date().getTime(), data: actions });
    }

    async function keyword_add(keyword) {
        if (keywords.data.indexOf(keyword) != -1) { return; }

        let keyword_actions_draft = keyword_actions.data;
        keyword_actions_draft.push({ action: "create", word: keyword });
        set_keyword_actions_state(keyword_actions_draft);
        
        let keywords_draft = keywords.data;
        keywords_draft.push(keyword);
        set_keywords_state(keywords_draft);
    }

    async function keyword_remove(keyword) {
        let keyword_actions_draft = keyword_actions.data;
        for (let i = 0; i < keyword_actions_draft.length; i++) {
            if (i.word == keyword) {
                keyword_actions_draft.splice(i, 1);
            }
        }
        keyword_actions_draft.push({ action: "remove", word: keyword });
        set_keyword_actions_state(keyword_actions_draft);

        let keywords_draft = keywords.data;
        keywords_draft.splice(keywords_draft.indexOf(keyword), 1);
        set_keywords_state(keywords_draft);
    }

    const keywords_ul = keywords.data.map((data) => {
        return (
            <Rows_backdrop_row1 header={data} right={<button onClick={() => { keyword_remove(data); }}>Delete</button>}/>
        )
    });

    function new_image(e) {
        set_image(e.image);
        set_external_image(e.image_url);
    }

    if (loading == true) {
        return (
            <Home1 className="keyword_page home_padding" slim_for_back={true}>
                <Loading/>
            </Home1>
        )
    }

    return (
        <Home1 className="keyword_page home_padding" slim_for_back={true}>
            <div className='settings'>
                <Backdrop_content header="About">
                    <Selector1 src={image || external_image} onImage={new_image}/>

                    <Input_with_header header="Description" placeholder="[..]" value={description} onChange={(e) => { set_description(e.target.value) }}/>

                    <Input_with_header header="Information link" placeholder="https://example.com/" value={external_link} onChange={(e) => { set_external_link(e.target.value) }}/>
                </Backdrop_content>

                <Backdrop_content header="Keywords">
                    {keywords_ul}
                    <button className='non-centered-button' onClick={() => { let keyword = prompt(""); if (keyword) { keyword_add(keyword); } }}>Add Keyword</button>
                </Backdrop_content>

                <Button1 onClick={keyword_update}>Save</Button1>
            </div>
        </Home1>
    )
}