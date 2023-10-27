import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "../../footer/Footer";
import Header from "../../header/Header";
import Input from "../../form/Input";
import styles from "./EditUserProfile.module.css"; // Assuming a new stylesheet for Edit User Profile
import IndicatesRequired from "../../form/IndicatesRequired";
import MessageRibbon from "../../form/MessageRibbon";

const EditUserProfile = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    country_name: "",
    mobile_phone: "",
    work_phone: "",
    home_phone: "",
    email: "",
  });

  const [errorMessages, setErrorMessages] = useState([]);
  const [countryCodes, setCountryCodes] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/countries")
      .then((response) => {
        setCountryCodes(response.data.countries);
      })
      .catch((error) => {
        console.error("Error fetching country codes:", error);
      });

    // Fetching current user profile data
    axios
      .get("http://localhost:5000/user-profile")  // Assuming this endpoint for fetching user profile data
      .then((response) => {
        setFormData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user profile:", error);
      });
  }, []);

  // Rest of your code (handleInputChange, validation functions, etc.) will mostly remain the same

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(formData);

    // All your validation logic here

    if (errors.length === 0) {
      axios
        .put("http://localhost:5000/edit-user-profile", formData) // Assuming PUT method for updating user profile
        .then((response) => {
          console.log(response.data);
          navigate("/profile"); // Navigate to profile page after successful update
        })
        .catch((error) => {
          console.error("Error updating user profile:", error);
        });
      setErrorMessages([]);
    } else {
      setErrorMessages(errors);
    }
  };

  return (
    <div>
      <Header />
      <MessageRibbon messageList={errorMessages} />
      <IndicatesRequired />
      <form onSubmit={handleSubmit} noValidate>
        {/* Your form structure and Input components go here, similar to Register form */}

        <div className={styles["button-ribbon"]}>
          <button>Update Profile</button>
          <a href="http://localhost:3000/profile">Go Back to Profile</a>
        </div>
      </form>
      <Footer />
    </div>
  );
};

export default EditUserProfile;
