import React from "react";
import styles from "./SideNav.module.css";
import { Link } from 'react-router-dom';

const SideNav = (props) => {
  return (
    <div className={styles.sidenav}>
      <ul className={styles.listGroup}>
        <li className={styles.listItem}>
          <Link to="/register">Register</Link>
        </li>
        <li className={styles.listItem}>
          <Link to="/profile/edit">Edit User Profile</Link>
        </li>
        <li className={styles.listItem}>
          <Link to="/remote-viewing">Remote Viewing</Link>
        </li>
        <li className={styles.listItem}>
          <Link to="/calendar">Calendar</Link>
        </li>
      </ul>
    </div>
  );
};

export default SideNav;
