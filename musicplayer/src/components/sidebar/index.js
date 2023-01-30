import React from "react";
import "./sidebar.css";
import SidebarButton from "./sidebarButton";
import { MdOutlineFeed, MdFavorite } from "react-icons/md";
import { FaGripfire, FaPlay, FaSignOutAlt } from "react-icons/fa";
import { IoLibrary } from "react-icons/io5";

export default function Sidebar() {
  return (
    <div className="sidebar-container">
      <img
        src="https://pbs.twimg.com/media/FSzYNjIacAIrx1d.jpg:small"
        className="profile-img"
        alt="profile"
      />
      <div>
        <SidebarButton title="Feed" to="/feed" icon={<MdOutlineFeed />} />
        <SidebarButton title="Trending" to="/trending" icon={<FaGripfire />} />
        <SidebarButton title="Player" to="/player" icon={<FaPlay />} />
        <SidebarButton
          title="Favorites"
          to="/favorites"
          icon={<MdFavorite />}
        />
        <SidebarButton title="Library" to="/" icon={<IoLibrary />} />
      </div>
      <SidebarButton title="Sing Out" to="" icon={<FaSignOutAlt />} />
    </div>
  );
}
