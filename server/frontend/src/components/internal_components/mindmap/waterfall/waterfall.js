import React from 'react';
import './css/waterfall.css';
import MessageInject from '../message_inject/message_inject.js';

export default function Waterfall(props) {
    const data_array = props.data;

    function render_item(item, item_index, style, hops) {
        let margin_left = 0;
        let Inner_Items = item.into ? item.into.map((inner_item, inner_item_index) => {
            margin_left = 40 * hops;
            return render_item(inner_item, inner_item_index, { marginLeft: margin_left }, hops+1);
        }) : null;

        let show_add_row = false;
        // if (!hops || (hops && data_array[hops-1] && data_array[hops-1].length == item_index)) {
        //     show_add_row = true;
        // }

        return (
            <div className='item_div'>
                <div key={item_index} style={style} className="item">
                    <MessageInject className='item_text'>
                        {item.content}
                    </MessageInject>

                    {show_add_row && <button className='waterfall_item_add_row hover greyText'>
                        <img src="/icons/add_circle.svg"/>
                        Add Row
                    </button>}
                </div>

                {Inner_Items}
            </div>
        )
    };

    const Arrow_Item = data_array.map((column, index) => {
        return column.map((item, item_index) => {
            return render_item(item, item_index, null, 1);
        });
    });

    return (
        <div className="waterfall-container">
            {Arrow_Item}
        </div>
    );
};