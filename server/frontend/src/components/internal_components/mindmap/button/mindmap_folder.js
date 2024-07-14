import { useEffect, useRef, useState } from 'react';
import './css/mindmap_folder.css';
import Link from 'next/link';

export default function Mindmap_folder(props) {
    const data = props.data;
    const icons = {"private": "lock-solid.svg", "unlisted": "link-solid.svg", "public": "earth-americas-solid.svg"};

    const should_run = useRef(true);
    const [url, set_url] = useState(null);

    useEffect(() => {
        if (should_run.current != true) { return; }
        should_run.current = false;

        let params = new URLSearchParams(window.location.search);
        params.set("folder", data.id);

        let url = new URL(window.location.href);
        url.search = params;

        set_url(url.href);
    });

    function press() {
        if (!props.onSelect) { return; }
        props.onSelect(data.id);
    }

    return (
        <button className='mindmap_item_button hover'>
            {url && <Link onClick={press} href={url} className='mindmap_item_button_left'>
                {/* <img src={"/icons/"+icons[data.visibility]}/> */}
                <img src={"/icons/folder.svg"}/>
                <p className='title'>{data.title}</p>
            </Link>}
            <div className='mindmap_item_button_right'>
                <img id="hover_to_hide" className='hover' src="/icons/ellipsis-solid.svg"/>
            </div>
        </button>
    )
}