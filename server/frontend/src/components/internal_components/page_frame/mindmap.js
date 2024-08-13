import './css/mindmap.css';
import Home1 from "@/components/home/home";
import Waterfall from "@/components/internal_components/mindmap/waterfall/waterfall";
import Layout_Topbar from "@/components/layout/layout_topbar";
import Loading from '@/components/navigating/in-progress/loading';
import { build_nested_structure, creds } from "@/global";
import { Journal } from "@oracularhades/journal";
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from "react";

export default function Page_frame_mindmap() {
    const router = useRouter();

    const should_run = useRef(true);
    const [item, set_item] = useState(null);
    const [rows, set_rows] = useState([]);
    const [editing, set_editing] = useState(false);
    const [loading, set_loading] = useState(true);

    async function get_item_content() {
        set_loading(true);
        
        const response = await Journal(creds()).item.content.list({ item: router.query.id });
        set_item(response.item);
        set_rows(response.data);

        set_loading(false);
    }

    useEffect(() => {
        if (should_run.current == router.query.id || !router.query.id) { return; }
        should_run.current = router.query.id;

        get_item_content();
    });

    // const dataArray = [
    //     [
    //         {
    //             content: 'Why is :~water~: important?',
    //             into: [
    //                 {
    //                     content: 'Almost all water (96.5%) is in the oceans. Fresh water is rare and precious.',
    //                     into: []
    //                 },
    //                 {
    //                     content: 'Water fills our cells. Up to 60% of an adult human is water.',
    //                     into: []
    //                 },
    //                 {
    //                     content: 'All other animals rely on water too, both as part of their bodies and as a place to live.',
    //                     into: []
    //                 },
    //                 {
    //                 content: ':~Plants~: also depend on water. They need water to transport food and minerals around their bodies, to make food in photosynthesis and for support.',
    //                     into: []
    //                 }
    //             ]
    //         }
    //     ],
        // [
        //     {
        //         id: '',
        //         content: 'The properties of water ',
        //         into: [
        //             {
        //                 id: '',
        //                 content: "It is the special properties of water that make it important to life. "
        //             },
        //             {
        //                 id: '',
        //                 content: "Three important properties of water:",
        //                 into: [
        //                     {
        //                         id: '',
        //                         content: "Water is a very good solvent.",
        //                         into: [
        //                                 {
        //                                     id: '',
        //                                     content: "Many substances dissolve in it.",
        //                                     into: [
        //                                         {
        //                                             id: '',
        //                                             content: "Test item 2",
        //                                             into: [
        //                                                 {
        //                                                     id: '',
        //                                                     content: "Test item 3"
        //                                                 },
        //                                             ]
        //                                         },
        //                                     ] 
        //                                 },
        //                             { id: '', content: "All the chemical reactions of life take place in solution in water." },
        //                             { id: '',content: "Sea water contains 3.5% dissolved sodium chloride (salt) an many other minerals." },
        //                             { id: '', content: "Your blood is water containing many dissolved food molecules, mineral salts and chemical messengers, as well as your blood cells." }
        //                         ]
        //                     },
        //                 ]
        //             },
        //             {
        //                 id: '',
        //                 content: "Water is also in our organs (insert table 1, p 79)"
        //             },
        //             {
        //                 id: '',
        //                 content: "All other animals rely on water too, both as part of their bodies and as a place to live."
        //             },
        //             {
        //                 id: '',
        //                 content: "Plants also depend on water. They need water to transport food and minerals around their bodies, to make food in photosynthesis and for support."
        //             }
        //         ]
        //     }
        // ],
    //     [
    //         {
    //             content: 'Item 3',
    //             into: []
    //         }
    //     ]
    // ];

    if (loading == true) {
        return (
            <Loading/>
        )
    }

    return (
        <Home1>
            {item && <Layout_Topbar>
                <div className="mindmap">
                    <p className="title">{item.title}</p>
                </div>
            </Layout_Topbar>}

            <div className='item_page'>
                <div className='editing_container secondary_element'>
                    <input type="checkbox" checked={editing} onChange={() => { set_editing(!editing); }}/>
                    <p>Editing</p>
                </div>

                <Waterfall data={build_nested_structure(rows)} item={item} refresh={get_item_content} editing={editing}/>
            </div>
        </Home1>
    )
}