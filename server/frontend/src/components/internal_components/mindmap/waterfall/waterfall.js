import React, { useState } from 'react';
import './css/waterfall.css';
import MessageInject from '../message_inject/message_inject.js';
import { Journal } from '@oracularhades/journal';
import { create_item, creds, update_item } from '@/global';

export default function Waterfall(props) {
    const data_array = props.data;
    const [random, set_random] = useState(0);
    const [parent_editing, set_parent_editing] = useState([]);

    async function edit_submit_handling(content, item, parent, should_create_item) {
        let rank = item.rank+1;

        // document.getElementById(`${item.id}-input`).value
        if (should_create_item == true) {
            await create_item(parent, rank, props.item.id, content);
        } else {
            await update_item(item.row_id, parent, rank, props.item.id, content);
        }

        if (props.refresh()) {
            props.refresh();
        }
    }

    async function mark_creating(before_item, parent) {
        if (parent_editing.includes(before_item.row_id)) {
            return;
        }

        let parent_editing_v = parent_editing;
        parent_editing_v.push(before_item.row_id);
        set_parent_editing(parent_editing_v);
        set_random(new Date());

        const content = prompt("");
        await edit_submit_handling(content, before_item, parent, true);
    }

    async function discard_editing(before_item) {
        let parent_editing_v = parent_editing;
        parent_editing_v.splice(parent_editing_v.indexOf(before_item.id), 1);
        set_parent_editing(parent_editing_v);
        set_random(new Date());
    }

    const Create_row = ((props) => {
        return (
            <button onClick={() => { mark_creating(props.item, props.parent); }} className={`waterfall_item_add_row hover greyText ${props.className}`}>
                <img src="/icons/add_circle.svg"/>
                Create Row
            </button>
        )
    });
    
    if (data_array.length == 0) {
        return (
            <div>
                <p className='greyText'>No Rows</p>
                <Create_row item={{ id: null, rank: -1 }}/>
            </div>
        )
    }

    function render_item(item, item_index, hops, style) {
        let margin_left = 0;

        let Inner_Items = item && item.into ? item.into.map((inner_item, into_index) => {
            margin_left = 40 * hops;
            return render_item(inner_item, into_index, hops+1, { marginLeft: margin_left });
        }) : null;

        let show_add_row = true;
        // if (!hops || (hops && data_array[hops-1] && data_array[hops-1].length == item_index)) {
        //     show_add_row = true;
        // }

        return (
            <div className='item_div'>
                <div key={item_index} style={style} className="item">
                    <div className='row'>
                        {props.editing == true && <button className='trash'><img src="/icons/trash.svg"/></button>}

                        {/* {!item.parent && <img style={{ width: 6, height: 6 }} src="/icons/circle-solid.svg"/>} */}
                        {/* {item.parent && <img src="/icons/arrow-right-alt.svg"/>} */}
                        <img src="/icons/arrow-right-alt.svg"/>
                        {props.editing != true && <MessageInject className='item_text' keywords={props.keywords}>
                            {item.content}
                        </MessageInject>}
                        {props.editing == true && <textarea className='editing_textarea' value={item.content}/>}
                    </div>

                    {show_add_row && props.editing == true && <Create_row item={item} parent={item.row_id} className="waterfall_item_add_row_push_under"/>}
                </div>

                {Inner_Items}
            </div>
        );
    };

    const Arrow_Item = data_array.map((column, section_index) => {
        return column.map((item, item_index) => {
            // console.log("item_index", item_index)
            return render_item(item, item_index, 1, null);
        });
    });

    return (
        <div className="waterfall-container">
            {Arrow_Item}
            {props.editing == true && <Create_row item={{ id: null, rank: Arrow_Item.length }}/>}
        </div>
    );
};