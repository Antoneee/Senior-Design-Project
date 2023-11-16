import React from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../../helpers/AuthContext";
import Header from "../../header/Header";
import MessageRibbon from "../../form/MessageRibbon";
import IndicatesRequired from "../../form/IndicatesRequired";
import Input from "../../form/Input";
import Footer from "../../footer/Footer";
import formStyles from "../../form/Form.module.css";
import calendarStyles from "./Calendar.module.css";
import { DateTimeToDateParser } from "../../../helpers/DateTimeParser";

const EditCalender = () => {
  const { eventId } = useParams();

  const navigate = useNavigate();

  const { authState } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    title: "",
    event_date: "",
    start_time: "",
    end_time: "",
    reminder_interval: "",
    invitees: [],
  });

  const [otherUsers, setOtherUsers] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/users/${authState.id}/events/${eventId}`)
      .then((response) => {
        const data = response.data.event[0];
        setFormData({
          title: data.title,
          event_date: DateTimeToDateParser(data.event_date),
          start_time: data.start_time,
          end_time: data.end_time,
          reminder_interval: data.reminder_interval,
          invitees: data.invitees,
        });
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
      });
    axios
      .get(`http://localhost:5000/users/exclude/${authState.id}`)
      .then((response) => {
        setOtherUsers(response.data.users);
      })
      .catch((error) => {
        console.error("Error fetching other users:", error);
      });
  }, [authState.name]);

  const reminderIntervals = ["None"];

  for (let minutes = 5; minutes <= 60; minutes += 5) {
    reminderIntervals.push(minutes);
  }

  const [errorMessages, setErrorMessages] = useState([]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const addInvitee = (userId) => {
    if (!formData.invitees.includes(userId)) {
      setFormData({ ...formData, invitees: [...formData.invitees, userId] });
    }
  };

  const handleDelete = () => {
    axios
      .delete(`http://localhost:5000/users/${authState.id}/events/${eventId}`)
      .then((response) => {
        navigate("/calendar");
      })
      .catch((error) => {
        console.error("Error deleting event:", error);
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const errors = [];

    const fieldToLablesMap = {
      title: "Title",
      event_date: "Date",
      start_time: "Start Time",
      end_time: "End Time",
      invitees: "Invitees",
      reminder_interval: "Reminder",
    };

    // Validation for required fields
    const requiredFields = [
      "title",
      "event_date",
      "start_time",
      "end_time",
      "invitees",
    ];

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        errors.push(`${fieldToLablesMap[field]} is required.`);
      }
    });

    // Validation for field lengths
    const fieldsToCheckLength = ["title"];
    fieldsToCheckLength.forEach((field) => {
      if (formData[field] && formData[field].length > 50) {
        errors.push(
          `${fieldToLablesMap[field]} must be 50 characters or less.`
        );
      }
    });

    formData.invitees = "{" + formData.invitees.join(",") + "}";

    if (formData.reminder_interval === "None") formData.reminder_interval = 0;

    if (errors.length === 0) {
      axios
        .put(
          `http://localhost:5000/users/${authState.id}/events/${eventId}`,
          formData
        )
        .then((response) => {
          if (!response.data.error) {
            setErrorMessages([]);
            setFormData({
              email: "",
              password: "",
            });
            navigate("/calendar");
          }
        })
        .catch((error) => {
          errors.push("Failed to update event.");
          setErrorMessages(errors);
          console.error("Error updating event:", error);
        });
    } else {
      setErrorMessages(errors);
    }
  };

  return (
    <div>
      <Header />
      <div
        className={`${formStyles["form-component"]} ${calendarStyles["add-calendar-component"]}`}
      >
        <h1 className={formStyles["form-heading"]}>Edit Calendar Event</h1>
        <MessageRibbon messageList={errorMessages} />
        <IndicatesRequired />
        <form onSubmit={handleSubmit} noValidate>
          <div className={formStyles["form-container"]}>
            <div className={calendarStyles["calendar-form-container"]}>
              <Input
                label={"Title"}
                type={"text"}
                name={"title"}
                value={formData.title}
                onChange={handleInputChange}
                required={true}
              />
              <div className={calendarStyles["calendar-form-col-container"]}>
                <div className={calendarStyles["calendar-form-col-item"]}>
                  <Input
                    label={"Date"}
                    type={"date"}
                    name={"event_date"}
                    value={formData.event_date}
                    onChange={handleInputChange}
                    required={true}
                  />
                </div>
                <div className={calendarStyles["calendar-form-col-item"]}>
                  <Input
                    label={"Start Time"}
                    type={"time"}
                    name={"start_time"}
                    value={formData.start_time}
                    onChange={handleInputChange}
                    required={true}
                  />
                </div>
                <div className={calendarStyles["calendar-form-col-item"]}>
                  <Input
                    label={"End Time"}
                    type={"time"}
                    name={"end_time"}
                    value={formData.end_time}
                    onChange={handleInputChange}
                    required={true}
                  />
                </div>
              </div>
              <div className={calendarStyles["calendar-form-col-container"]}>
                <div className={calendarStyles["calendar-form-col-item"]}>
                  <label>
                    <span className={formStyles["required"]}>* </span>Invitees
                  </label>
                  <ul className={calendarStyles.invitees}>
                    {otherUsers.map((otherUser) => {
                      return (
                        <li
                          className={
                            formData.invitees.includes(otherUser.id)
                              ? `${calendarStyles.selected}`
                              : ""
                          }
                          onClick={() => addInvitee(otherUser.id)}
                          key={otherUser.id}
                        >
                          {otherUser.first_name}
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <div className={calendarStyles["calendar-form-col-item"]}>
                  <Input
                    label={"Reminder"}
                    type={"select"}
                    name={"reminder_interval"}
                    value={formData.reminder_interval}
                    onChange={handleInputChange}
                    required={true}
                    selectItems={reminderIntervals}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className={formStyles["button-ribbon"]}>
            <button className={calendarStyles["save-btn"]} type="submit">
              Save
            </button>
            <button
              className={calendarStyles["delete-btn"]}
              type="button"
              onClick={handleDelete}
            >
              Delete
            </button>
            <Link className={formStyles["redirect-link"]} to="/calendar">
              Cancel
            </Link>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default EditCalender;
