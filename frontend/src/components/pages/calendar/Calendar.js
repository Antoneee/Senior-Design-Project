import React from "react";
import { useState, useEffect, useContext } from "react";
import Header from "../../header/Header";
import Footer from "../../footer/Footer";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import SideNav from "../../sidenav/SideNav";
import styles from "./Calendar.module.css";
import { AuthContext } from "../../../helpers/AuthContext";
import axios from "axios";
import { DateToDateTimeParser } from "../../../helpers/DateTimeParser";

const localizer = momentLocalizer(moment);

const Calendar = () => {
  const navigate = useNavigate();

  const { authState } = useContext(AuthContext);

  const [events, setEvents] = useState([]);

  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    axios
      .get(`http://localhost:5000/users/${authState.id}/events`)
      .then((response) => {
        setEvents(response.data.events);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
      });
  }, [authState.name]);

  const handleEventClick = (event) => {
    navigate(`/calendar/edit/${event.id}`);
  };

  const handleEmptyDateClick = (date) => {
    navigate("/calendar/add");
  };

  const CustomToolbar = () => {
    const date = new Date(selectedDate);
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = date.toLocaleDateString("en-US", options);
    return <div>{`${formattedDate}`}</div>;
  };

  return (
    <div>
      <Header />
      <SideNav calendar={true} setSelectedDate={setSelectedDate} />
      <BigCalendar
        events={events.map((event) => ({
          ...event,
          start_time: DateToDateTimeParser(event.start_time),
          end_time: DateToDateTimeParser(event.end_time),
        }))}
        localizer={localizer}
        selectable={true}
        onSelectEvent={handleEventClick}
        onSelectSlot={handleEmptyDateClick}
        startAccessor="start_time"
        endAccessor="end_time"
        defaultView="day"
        defaultDate={new Date()}
        date={selectedDate}
        components={{ toolbar: CustomToolbar }}
        onNavigate={(newDate) => setSelectedDate(newDate)}
        className={styles.calendar}
      />
      <Footer />
    </div>
  );
};

export default Calendar;
