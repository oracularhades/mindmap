import './css/keyword.css';
import "@/../styles/global.css";
import "@/components/global.css";
import Home1 from "@/components/home/home";
import { useEffect, useRef, useState } from "react";
import Backdrop_content from '@/components/rows/backdrop/backdrop_content';
import Rows_backdrop_row1 from '@/components/rows/backdrop/rows/rows-backdrop-row1';
import Input_with_header from '@/components/input/input_with_header';
import Selector1 from '@/components/media/selectors/selector1';

export default function Keywords() {
    const should_run = useRef(true);
    const [data, set_data] = useState([]);

    useEffect(() => {
        if (should_run.current != true) { return; }
        should_run.current = false;

        // get_keywords();
    });

    return (
        <Home1 className="keyword_page home_padding">
            <div className='settings'>
                <Backdrop_content header="About">
                    <Selector1 src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Flower_poster_2.jpg/902px-Flower_poster_2.jpg"></Selector1>

                    <Input_with_header header="Description" placeholder="[..]"/>

                    <Input_with_header header="Information link" placeholder="https://example.com/"/>

                    <button className='non-centered-button'>Save</button>
                </Backdrop_content>

                <Backdrop_content header="Keywords">
                    {/* <Rows_backdrop_row1 header="Flower" right={<button>Delete</button>}/> */}
                    <button className='non-centered-button'>Add Keyword</button>
                </Backdrop_content>
            </div>
        </Home1>
    )
}