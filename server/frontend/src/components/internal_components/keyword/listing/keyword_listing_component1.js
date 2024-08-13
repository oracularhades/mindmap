import "@/../styles/global.css";
import "@/components/global.css";
import './css/keyword_listing_component1.css';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Keyword_listing_component1(props) {
    const router = useRouter();

    if (!props.data) {
        return <p>Keyword listing component here, but no data was passed.</p>
    }
    const data = props.data;

    const Right_Button = ((props) => {
        return (
            <button onClick={() => { router.push(props.href); }} className='right_button'>
                <img src={props.icon}/>
            </button>
        )
    });

    return (
        <div className='keyword_listing_component secondary_element shade'>
            <Link href={`/keyword/${data.id}`} className='keyword_listing_component_left'>
                <img className='keyword_listing_component_icon' src={data.image}/>
                <div className='keyword_listing_component_metadata'>
                    <p className='keyword_listing_component_metadata_alias'>{data.keywords && data.keywords.join(", ")}</p>
                    <p className='keyword_listing_component_metadata_description'>{new Date(data.created).toLocaleDateString()} • {data.description}</p>
                </div>
            </Link>

            {props.hide_right_buttons != true && <div className='keyword_listing_component_right'>
                <Right_Button href={`/keyword/${data.id}`} icon="/icons/pencil_border.svg"/>
                <Right_Button icon="/icons/trash.svg"/>
            </div>}
        </div>
    )
}