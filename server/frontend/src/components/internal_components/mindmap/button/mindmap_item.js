import './css/mindmap_item.css';
import Link from 'next/link';

export default function Mindmap_item(props) {
    const data = props.data;
    const icons = {"private": "lock-solid.svg", "unlisted": "link-solid.svg", "public": "earth-americas-solid.svg"};

    let safe_link = null;
    if (typeof window != "undefined") {
        let draft_link = new URL(window.location.href);
        draft_link.pathname = `/mindmap/${data.id}`;

        safe_link = draft_link.href;
    }

    return (
        <Link href={safe_link}>
            <button className='mindmap_item_button hover'>
                <div className='mindmap_item_button_left'>
                    <img src={"/icons/"+icons[data.visibility]}/>
                    <p className='mindmap_item_button_left title'>{data.title}</p>
                </div>
                <div className='mindmap_item_button_right'>
                    <img id="hover_to_hide" className='hover' src="/icons/ellipsis-solid.svg"/>
                </div>
            </button>
        </Link>
    )
}