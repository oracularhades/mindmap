import { useState } from "react"

export default function Button1(props) {
    const [disabled, set_disabled] = useState(false);

    async function on_click() {
        if (!props.onClick) { return; }

        set_disabled(true);

        await props.onClick();

        set_disabled(false);
    }
    return (
        <button disabled={disabled} {...props} onClick={on_click}>{props.children}</button>
    )
}