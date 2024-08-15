import Link from "next/link";
import "./css/message_inject.css";
import { UrlThroughParser } from '../../../global.js';

export default function MessageInject(props) {
    if (!props.children) {
        return;
    }

    let text = props.children;
    if (Array.isArray(text)) {
        text = text.join("");
    }

    let style = {
        ...props.style
    }

    let arrays = [];
    let run_count = -1;

    const message = text.split("\n").map((line) => {
        return <div className="message_inject_line_div">{line.split(":").map((data) => {
            run_count++;

            let keyword = null;
            if (props.keywords) {
                props.keywords.forEach((keyword_item) => {
                    if (keyword_item.keywords.includes(data.toLowerCase())) {
                        keyword = keyword_item;
                    }
                });
            }

            if (data.startsWith("@") && data.replaceAll("@").length > 0) {
                let output = data;
                let end = "";
                const before = data.substr(0, data.replace("@", "").search(/[^a-zA-Z0-9!#$%^&*_]/)+1);
                if (before.replace("@", "").length < data.replace("@", "").length && before.length > 0) {
                    output = before;
                    end = data.substr(output.length, data.length);
                }

                output = output.replaceAll(/[^a-zA-Z0-9!#$%^&*_]/g, ""); // use this for safety.

                return <p id="donot"><Link id="donot" href={`/@${output}`} className="hoverUnderline greyA">@{output}</Link>{end}&nbsp;</p>
            // } else if (data.startsWith("~") && data.endsWith("~") && data.replaceAll("~", "").length > 0) {
            } else if (keyword != null) {
                return <div className="message_inject_mindmap_keyword">
                    <div className="message_inject_mindmap_keyword_img_holder">
                        <img id="donot" className='emoteImgImg disable-select' src={keyword.image || keyword.external_image}/>
                    </div>
                    {/* <a href="https://example.com">{data.slice(1, data.length-1)}</a> */}
                    <a target="_blank" rel="noreferrer" href={keyword.external_link}>{data}</a>
                </div>
            } else if (props.showLinks == true && /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/.test(data) == true && data.startsWith("https")) {
                if (props.hideThoughtLinks == true && data.startsWith("https://example.com/thought/") && /[^a-zA-Z0-9/:.]/g.test(data.content) == false && /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/.test(data) == true) {
                    return;
                }
                if (props.hideGifLinks && data.startsWith("https://media.tenor.com/")) {
                    return;
                }

                const urlData = UrlThroughParser(data);

                return <Link href={urlData} id="donot" className={``} target="_blank" rel="noreferrer" to={urlData}>{urlData}&nbsp;</Link>
            } else {
                if (typeof arrays[arrays.length] === 'string' || arrays[arrays.length] instanceof String) {
                    arrays[arrays.length] = `${arrays[arrays.length]} ${data}`;
                } else {
                    arrays.push(data);
                }
                
                return <span>{data}&nbsp;</span>
            }
        })}
        </div>
    });
    
    if (props.link) {
        return <Link href={props.link} onClick={props.onClick} key={props.tkey} id={props.div_id} style={style} className={`messageInject ${props.className}`}>{message}</Link>
    } else {
        return <div onClick={props.onClick} key={props.tkey} id={props.div_id} style={style} className={`messageInject ${props.className}`}>{message}</div>
    }
}