import './css/keywords.css';
import "@/../styles/global.css";
import "@/components/global.css";
import Home1 from "@/components/home/home";
import { useEffect, useRef, useState } from "react";
import Keyword_listing_component1 from "@/components/internal_components/keyword/listing/keyword_listing_component1";
import { Journal } from '@oracularhades/journal';
import { creds } from '@/global';
import Link from 'next/link';
import Loading from '@/components/navigating/in-progress/loading';

export default function Keywords() {
    const should_run = useRef(true);
    const [data, set_data] = useState([]);
    const [loading, set_loading] = useState(true);

    async function get_keywords() {
        set_loading(true);

        const response = await Journal(creds()).keyword.list();
        set_data(response.data);

        set_loading(false);
    }

    useEffect(() => {
        if (should_run.current != true) { return; }
        should_run.current = false;

        get_keywords();
    });

    const keyword_ul = data.map((keyword) => {
        return (
            <Keyword_listing_component1 data={{ id: keyword.id, keywords: keyword.keywords, image: keyword.external_image || keyword.image, description: keyword.description, created: keyword.created }}/>
        )
    });

    return (
        <Home1 className="keywords_page home_padding" slim_for_back={true}>
            <div className="top">
                <h1>Keywords</h1>
                <Link href="/keyword/create"><button>Create keyword</button></Link>
            </div>

            {loading == false && <div className='keyword_inner'>
                <input placeholder='Search' className='search'/>
                <div className="keyword_ul">
                    {keyword_ul}
                </div>
            </div>}
            {loading == true && <Loading/>}
        </Home1>
    )
}