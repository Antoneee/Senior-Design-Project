import React from "react";
import styles from "./SideNav.module.css";
import { Link } from 'react-router-dom'; // Import the Link component

const SideNav = (props) => {
  return (
    <div className={styles["sidenav"]}>
      <ul className="list-group"> {/* Use className instead of class */}
        <li className="list-group-item"> {/* Use className instead of class */}
          <u>
            <Link to="/register">Register</Link> {/* Use Link instead of <a> */}
          </u>
        </li>
        <li className="list-group-item">
          <u>
            <Link to="/profile/edit">Edit User Profile</Link>
          </u>
        </li>
        <li className="list-group-item">
          <u>
            <Link to="/remote-viewing">Remote Viewing</Link>
          </u>
        </li>
        <li className="list-group-item">
          <u>
            <Link to="/calendar">Calendar</Link>
          </u>
        </li>
      </ul>
    </div>
  );
};

export default SideNav;
