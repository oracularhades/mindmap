import React, { useState } from 'react';
import './css/waterfall.css';
import MessageInject from '../message_inject/message_inject.js';
import { Journal } from '@oracularhades/journal';
import { create_item, creds, update_item } from '@/global';

export default function Waterfall(props) {
    const [data_array, set_data_array] = useState(props.data);
    const [random, set_random] = useState(0);
    const [editing, set_editing] = useState([]);

    async function edit_submit_handling(item, should_create_item) {
        if (should_create_item == true) {
            create_item(item.parent, item.rank, item.item, document.getElementById(`${item.id}-input`).value);
        } else {
            update_item(item.row_id, item.parent, item.rank, item.item, document.getElementById(`${item.id}-input`).value);
        }
    }

    async function mark_creating(before_item, hops) {
        hops = hops-2; // hops start from 1, not 0.
        console.log("before_item", before_item, data_array);
        const logs = await iterate_sections(before_item, data_array, []);
        console.log("LOGS OUTPUT", logs);

        let data_array_v = []; //log_into_pointer(data_array, logs);
        // console.log(section_index, item_index, into_index, hops, before_item, data_array);
        // alert(JSON.stringify(data_array_v[section_index][item_index]))
        // if (into_index != null) {
        //     data_array_v[section_index][item_index].into[into_index].splice(data_array_v[section_index][item_index].into.indexOf(before_item)+1, 0, { create: true });
        // } else {
        //     data_array_v[section_index][item_index].splice(data_array_v[section_index][item_index].indexOf(before_item)+1, 0, { create: true });
        // }
        // set_data_array(data_array_v);
        // set_random(new Date());
    }

    async function discard_editing(before_item, array_path, hops) {
        hops = hops-2; // hops start from 1, not 0.
        let data_array_v = data_array;
        for (let i = 0; i < array_path.length - 1; i++) {
            let element = array_path[i];
        }
        console.log("before_item", before_item, "array_path", array_path, "data_array", data_array);
        // console.log(section_index, item_index, hops, data_array);
        // if (data_array_v[section_index][item_index].into) {
        //     data_array_v[section_index][item_index].into.splice(data_array_v[section_index][item_index].into.indexOf(before_item), 1);
        // } else {
        //     data_array_v[section_index][item_index].splice(data_array_v[section_index][item_index].indexOf(before_item)+1, 1);
        // }
        set_data_array(data_array_v);
        set_random(new Date());

        // if (item.create == true) {
        //     let data_array_v = data_array;
        //     data_array_v[index].splice(data_array_v[index].indexOf(item), 1);
        //     set_data_array(data_array_v);
        //     set_random(new Date());
        // } else {
        //     let editing_v = editing;
        //     editing_v.splice(editing_v.indexOf(item.id), 1);
        //     set_editing(editing_v);
        //     set_random(new Date());
        // }
    }

    // if (i.indexOf(target) != -1) {
    //     // We found the array our target is in.
    //     target = array;
    //     return;
    // } else {
    //     return point_array(target, array)
    // }

    // function log_into_pointer(nestedArray, log, deleteCount, ...itemsToAdd) {
    //     let currentArray = nestedArray[log[0]][log[1]];

    //     console.log("currentArrayb4", currentArray, "log[0]", log[0], "log", log);
    
    //     // Traverse the nested arrays according to the log
    //     for (let i = 2; i < log.length - 1; i++) {
    //         currentArray = currentArray.into[log[i]];
    //         console.log("currentArray", currentArray)
    //     }
    
    //     // Splice the target array
    //     currentArray.splice(log[log.length - 1], deleteCount, ...itemsToAdd);

    //     // Return the modified nested array
    //     return nestedArray;
    // }

    // async function iterate_sections(target, sections, log) {
    //     for (let section_i = 0; section_i < sections.length; section_i++) {
    //         const array = sections[section_i];

    //         const iterate_status = await iterate_items(target, array, log, -1);
    //         console.log("iterate_sections iterate_status", iterate_status);
    //         if (iterate_status != null) {
    //             // Found an item. The log (path to that item in the array) will return here.
    //             console.log("iterate_sections Item found, stopping sections forloop.", iterate_status);
    //             return iterate_status;
    //         }
    //     }
    // }

    // async function iterate_items(target, items, log, instance) {
    //     let to_explore = [];
    //     instance++;
    //     console.log("STARTING", instance);

    //     for (let i = 0; i < items.length; i++) {
    //         console.log(`${i} / ${items.length}`, "items", items);
    //         if (items.indexOf(target) != -1) {
    //             console.log("We found our target, log: ", log, "items: ", items, "target", target);
    //             return log;
    //         }
            
    //         const item = items[i];
    //         console.log("ITEM_CHECK", item, items);
    //         if (item.into) {
    //             console.log("Moving...");
    //             log.push(i);
                
    //             to_explore.push({target, items: item.into, log});
    //             // let status = await iterate_items(target, items[i].into, log);
    //             // // We can't do 'return iterate_items', otherwise it kills the for loop, because 'iterate_items' finding something isn't guaranteed. Let's wait and see the result before moving on. If there's nothing, then we simply keep moving. If we find something, great! - there would be no need to keep going and thus we'd exit this for loop.
    //             // if (status == true) {
    //             //     console.log("Status was true!");
    //             //     return;
    //             // }
    //         } else {
    //             console.log("Found no more .into - target: ", target, "- array", items);
    //             // return null;
    //         }
    //     }

    //     let output = null;

    //     for (const data of to_explore) {
    //         let target = data.target;
    //         let items = data.items;
    //         let log = data.log;
    //         console.log("Exploring, items: ", items);
    //         const iterate_status = await iterate_items(target, items, log, instance);
    //         if (iterate_status != null) {
    //             console.log("Item was found, not continuing to_explore.forEach()", iterate_status, "instance", instance);
    //             output = iterate_status;
    //             // return iterate_status;
    //         }
    //     };

    //     console.log("Loop exit", output, "instance", instance, "data", data_array);
    //     return output;
    // }

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

        const Create_row = ((props) => {
            return (
                <button onClick={() => { mark_creating(item, hops); }} className='waterfall_item_add_row hover greyText'>
                    <img src="/icons/add_circle.svg"/>
                    Create Row
                </button>
            )
        });

        if (editing.includes(item.id) || item.create == true) {
            return (
                <div className='item_div'>
                    <div key={item_index} style={style} className="item">
                        <div className='item_edit'>
                            <textarea id={`${item.id}-input`} className='item_edit_input_textarea' placeholder='[..]' defaultValue={item.content} onChange={() => { set_random(Math.random()) }}/>
                            <div className='item_edit_underbelly'>
                                <p></p>
                                <div className='item_edit_action_buttons'>
                                    <button onClick={() => { discard_editing(item, array_path, hops); }} className='item_edit_action_buttons_cancel greyText hover'>Cancel</button>
                                    <button onClick={() => { edit_submit_handling(item, item.create ? true : false ); }} className='item_edit_action_buttons_submit'>Submit</button>
                                </div>
                            </div>
                        </div>

                        {show_add_row && <Create_row/>}
                    </div>

                    {Inner_Items}
                </div>
            )
        }
        return (
            <div className='item_div'>
                <div key={item_index} style={style} className="item">
                    <MessageInject className='item_text'>
                        {item.content}
                    </MessageInject>

                    {show_add_row && <Create_row/>}
                </div>

                {Inner_Items}
            </div>
        );
    };

    const Arrow_Item = data_array.map((column, section_index) => {
        return column.map((item, item_index) => {
            console.log("item_index", item_index)
            return render_item(item, item_index, 1, null);
        });
    });

    return (
        <div className="waterfall-container">
            {Arrow_Item}
        </div>
    );
};