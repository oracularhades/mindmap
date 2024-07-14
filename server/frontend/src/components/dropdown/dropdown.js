import '../css/dropdown.css';

export default function Dropdown(props) {
    return (
        <div style={props.style} className='dropdownul div'>
            {props.children}
        </div>
    )
}