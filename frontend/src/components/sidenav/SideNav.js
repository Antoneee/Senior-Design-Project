import React from "react";
import { useState, useContext } from "react";
import styles from "./SideNav.module.css";
import { Link } from "react-router-dom";
import { Calendar as SimpleCalendar } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { AuthContext } from "../../helpers/AuthContext";

const SideNav = (props) => {
  const { authState } = useContext(AuthContext);

  const [selectedDate] = useState(new Date());

  const handleDayClick = (date) => {
    props.setSelectedDate(date);
  };

  return (
    <div className={styles["sidenav"]}>
      <Link to="/" className={styles["logo"]}>
        uARexpert
      </Link>
      <ul className={styles["sidenav-links"]}>
        {!authState && (
          <>
            <li>
              <Link className={styles["sidenav-link"]} to="/register">
                Register
              </Link>
            </li>
            <div className={styles["horizontal-line"]}></div>
          </>
        )}
        <li>
          <Link
            className={styles["sidenav-link"]}
            to={`/profile/edit/${authState.id}`}
          >
            Edit User Profile
          </Link>
        </li>
        <div className={styles["horizontal-line"]}></div>
        {!props.remoteViewing && (
          <>
            <li>
              <Link className={styles["sidenav-link"]} to="/remote-viewing">
                Remote Viewing
              </Link>
            </li>
            <div className={styles["horizontal-line"]}></div>
          </>
        )}

        {props.calendar ? (
          <SimpleCalendar
            className={styles["small-calendar"]}
            value={selectedDate}
            onClickDay={handleDayClick}
          />
        ) : (
          <li>
            <Link className={styles["sidenav-link"]} to="/calendar">
              Calendar
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
};

export default SideNav;
