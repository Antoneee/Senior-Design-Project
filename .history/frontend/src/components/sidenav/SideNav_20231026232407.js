import React from "react";
import styles from "./SideNav.module.css";

const SideNav = (props) => {
  return (
    <div className={styles["sidenav"]}>
      <ul class="list-group">
        <li class="list-group-item">
          <u>
            <a href="http://localhost:3000/profile/edit">Edit User Profile</a>
          </u>
        </li>
        <li class="list-group-item">
          <u>
            <a href="http://localhost:3000/remote-viewing">Remote Viewing</a>
          </u>
        </li>
        <li class="list-group-item">
          <u>
            <a href="http://localhost:3000/calendar">Calendar</a>
          </u>
        </li>
      </ul>
    </div>
  );
};
export default SideNav;
