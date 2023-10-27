import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "../../footer/Footer";
import Header from "../../header/Header";
import Input from "../../form/Input";
import styles from "./EditProfile.module.css";
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
    // Assume you might fetch the user's current profile here as well
    axios
      .get("http://localhost:5000/countries")
      .then((response) => {
        setCountryCodes(response.data.countries);
      })
      .catch((error) => {
        console.error("Error fetching country codes:", error);
      });
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSaveChanges = (event) => {
    event.preventDefault();

    // Your data validation logic here, e.g., ensuring required fields have values, etc.

    axios
      .put("http://localhost:5000/updateProfile", formData)
      .then((response) => {
        console.log(response.data);
        // Navigate or display a success message
      })
      .catch((error) => {
        console.error("Error updating user profile:", error);
      });
  };

  const handleUnregister = () => {
    // Logic to unregister the user
  };

  const handleCancel = () => {
    navigate("/dashboard"); // or wherever you want to redirect the user
  };

  return (
    <div>
      <Header />
      <MessageRibbon messageList={errorMessages} />
      <IndicatesRequired />
      <form onSubmit={handleSaveChanges} noValidate>
        <div className={styles["form-container"]}>
          {/* ... Place all your Input components from your earlier form here ... */}
        </div>
        <div className={styles["button-ribbon"]}>
          <button type="submit">Save</button>
          <button onClick={handleUnregister}>Unregister</button>
          <button onClick={handleCancel}>Cancel</button>
        </div>
      </form>
      <Footer />
    </div>
  );
};

export default EditUserProfile;
