import React, { useEffect, useState } from "react";
import "./sidebar.css";
import SidebarButton from "./sidebarButton";
import {  FaPlay, FaSignOutAlt } from "react-icons/fa";
import { IoLibrary } from "react-icons/io5";
import apiClient from "../../spotify"

export default function Sidebar() {
  const [image, setImage] = useState(
    "https://freesvg.org/img/abstract-user-flat-4.png"
  );
useEffect(() =>{
  apiClient.get("me").then((response) =>{
    setImage(response.data.images[0].url);
    console.log(response.data.images[0].url);
  })
})

  return (
    <div className="sidebar-container">
      <img src={image} className="profile-img" alt="profile" />
      <div>        
        <SidebarButton title="Player" to="/player" icon={<FaPlay />} />       
        <SidebarButton title="Library" to="/" icon={<IoLibrary />} />
      </div>
      <SidebarButton title="Sing Out" to="" icon={<FaSignOutAlt />} />
    </div>
  );
}
