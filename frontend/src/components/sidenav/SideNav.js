import React from "react";
import { useState } from "react";
import styles from "./SideNav.module.css";
import { Link } from "react-router-dom";
import { Calendar as SimpleCalendar } from "react-calendar";
import "react-calendar/dist/Calendar.css";

const SideNav = (props) => {
  const [selectedDate] = useState(new Date());

  const handleDayClick = (date) => {
    props.setSelectedDate(date);
  };

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
        {props.calendar ? (
          <SimpleCalendar value={selectedDate} onClickDay={handleDayClick} />
        ) : (
          <li className={styles.listItem}>
            <Link to="/calendar">Calendar</Link>
          </li>
        )}
      </ul>
    </div>
  );
};

export default SideNav;
