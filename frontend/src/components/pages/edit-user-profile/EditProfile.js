import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "../../footer/Footer";
import Header from "../../header/Header";
import SideNav from "../../sidenav/SideNav";
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
      <SideNav />
      <MessageRibbon messageList={errorMessages} />
      <IndicatesRequired />
      <form onSubmit={handleSaveChanges} noValidate>
      <div className={styles["form-container"]}>
    <div className={styles["form-sub-container"]}>
        <Input
            label={"First Name"}
            type={"text"}
            name={"first_name"}
            value={formData.first_name}
            onChange={handleInputChange}
            required={true}
        />
        <Input
            label={"Last Name"}
            type={"text"}
            name={"last_name"}
            value={formData.last_name}
            onChange={handleInputChange}
            required={true}
        />
        <Input
            label={"Mobile Phone"}
            type={"text"}
            name={"mobile_phone"}
            value={formData.mobile_phone}
            onChange={handleInputChange}
            required={true}
        />
        <Input
            label={"Home Phone"}
            type={"text"}
            name={"home_phone"}
            value={formData.home_phone}
            onChange={handleInputChange}
            required={false}
        />
        <Input
            label={"Email Address"}
            type={"email"}
            name={"email"}
            value={formData.email}
            onChange={handleInputChange}
            required={true}
        />
    </div>
    <div className={styles["form-sub-container"]}>
        <Input
            label={"Middle Name"}
            type={"text"}
            name={"middle_name"}
            value={formData.middle_name}
            onChange={handleInputChange}
            required={false}
        />
        <Input
            label={"Country Code"}
            type={"select"}
            name={"country_name"}
            value={formData.country_name}
            onChange={handleInputChange}
            required={true}
            countryCodes={countryCodes}
        />
        <Input
            label={"Work Phone"}
            type={"text"}
            name={"work_phone"}
            value={formData.work_phone}
            onChange={handleInputChange}
            required={false}
        />
    </div>
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
