import './css/keywords.css';
import "@/../styles/global.css";
import "@/components/global.css";
import Home1 from "@/components/home/home";
import { useEffect, useRef, useState } from "react";
import Keyword_listing_component1 from "@/components/internal_components/keyword/listing/keyword_listing_component1";

export default function Keywords() {
    const should_run = useRef(true);
    const [data, set_data] = useState([]);

    useEffect(() => {
        if (should_run.current != true) { return; }
        should_run.current = false;

        // get_keywords();
    });

    return (
        <Home1 className="keywords_page home_padding">
            <div className="top">
                <h1>Keywords</h1>
                <button>Create keyword</button>
            </div>

            <div className='keyword_inner'>
                <input placeholder='Search' className='search'/>
                <div className="keyword_ul">
                    <Keyword_listing_component1 data={{ keywords: ["flower", "flowers"], alias: "flower", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Flower_poster_2.jpg/660px-Flower_poster_2.jpg", description: "A flower, also known as a bloom or blossom, is the reproductive structure found in flowering plants (plants of the division Angiospermae). Flowers consist of a combination of vegetative organs - sepals that enclose and protect the developing flower. These petals attract pollinators, and reproductive organs that produce gametophytes, which in flowering plants produce gametes. The male gametophytes, which produce sperm, are enclosed within pollen grains produced in the anthers. The female gametophytes are contained within the ovules produced in the carpels." }}/>
                </div>
            </div>
        </Home1>
    )
}