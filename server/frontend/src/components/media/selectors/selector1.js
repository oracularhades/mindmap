import { credentials_object, read_image_from_file_insert_into_element } from "@/global";
import "./css/selector1.css";
import { useRef, useState } from "react";

export default function Selector1(props) {
  let random = `selector1_${Math.floor(Math.random() * 10000)}_${new Date().getTime()}`;
  const image_data = useRef(null);

  async function upload_image() {
    // const image_upload = await Clubs(await credentials_object()).image().upload_media(image_data.current, props.type);
    // if (image_upload[0].error == true) {
    //   alert(image_data.message);
    //   return;
    // }

    // props.onImage({ image_id: image_upload[0].id, image_url: null });
  }

  async function upload_image_link() {
    const url = prompt("Enter your image link");
    if (!url) { return };

    document.getElementById(random).src = url;
    props.onImage({ image_id: null, image_url: url });
  }

  async function clear_upload() {
    image_data.current = "clear";
    document.getElementById(random).src = null;
    props.onImage({ image_id: null, image_url: null });
  }

  return (
    <div className="selector1 selector">
      <img className='AvatarPicture shading' style={{width:90,display:'flex',flexDirection:'column',alignSelf:'center',marginTop:0,borderRadius:4,backgroundColor:'grey'}} loading="lazy" id={random} src={props.src}/>
      <div className="selector1_content">
        <p className='selector_header'>{props.header}</p>
        <div className='selector_media_actions'>
          <button className="selector_media_button disable-select" disabled={true}>
            <label for="pfp_upload" className='selector_media_label'>
              <img className="navButton disable-select" src={`/icons/cloud_upload.svg`} alt="Upload"/>
              <p className='disable-select'>Upload</p>
            </label>
          </button>
          <input onChange={(e) => { read_image_from_file_insert_into_element(e.target.files[0], random); image_data.current = e.target.files[0]; upload_image(); }} hidden={true} id="pfp_upload" name="file" type="file" accept=".png, .gif, .jpg, .jpeg, .webp"/>

          <button onClick={() => { upload_image_link() }} className='selector_media_button shading hover'>
            <img className="navButton disable-select" src={`/icons/link-solid.svg`} alt="Use Link"/>
            <p className='disable-select'>Use Link</p>
          </button>

          <button onClick={() => { clear_upload(); }} className='selector_media_button shading hover'>
            <img className="navButton disable-select" src={`/icons/trash.svg`} alt="Clear"/>
            <p className='disable-select'>Clear</p>
          </button>
        </div>
      </div>
    </div>
  )
}