import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "../../footer/Footer";
import Header from "../../header/Header";
import SideNav from "../../sidenav/SideNav";
import Input from "../../form/Input";
import styles from "./Register.module.css";
import IndicatesRequired from "../../form/IndicatesRequired";
import MessageRibbon from "../../form/MessageRibbon";

const Register = () => {
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
    password: "",
    verify_password: "",
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
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    console.log(value);
    setFormData({ ...formData, [name]: value });
  };

  const isValidEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  };

  const isValidPhoneNumber = (phoneNumber) => {
    const phonePattern = /^[0-9]{10}$/;
    return phonePattern.test(phoneNumber);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(formData);

    const errors = [];

    const fieldToLablesMap = {
      first_name: "First name",
      middle_name: "Middle name",
      last_name: "Last name",
      country_name: "Country code",
      mobile_phone: "Mobile phone",
      work_phone: "Work phone",
      home_phone: "Home phone",
      email: "Email address",
      password: "Password",
      verify_password: "Verify password",
    };

    // Validation for required fields
    const requiredFields = [
      "first_name",
      "last_name",
      "country_name",
      "mobile_phone",
      "email",
      "password",
      "verify_password",
    ];

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        errors.push(`${fieldToLablesMap[field]} is required.`);
      }
    });

    // Validation for field lengths
    const fieldsToCheckLength = [
      "first_name",
      "middle_name",
      "last_name",
      "email",
      "password",
      "verify_password",
    ];
    fieldsToCheckLength.forEach((field) => {
      if (formData[field] && formData[field].length > 50) {
        errors.push(
          `${fieldToLablesMap[field]} must be 50 characters or less.`
        );
      }
    });

    // Validation for phone numbers (mobile, work, home)
    const phoneFields = ["mobile_phone", "work_phone", "home_phone"];
    phoneFields.forEach((field) => {
      if (
        formData[field] &&
        (formData[field].length > 10 || !isValidPhoneNumber(formData[field]))
      ) {
        errors.push(
          `${fieldToLablesMap[field]} must be 10 characters or less and valid.`
        );
      }
    });

    // Validation for email
    if (formData.email && !isValidEmail(formData.email)) {
      errors.push("Invalid email address.");
    }

    // Validation for password and verify_password
    if (formData.password !== formData.verify_password) {
      errors.push("Passwords do not match.");
    }

    console.log(errors);
    if (errors.length === 0) {
      axios
        .post("http://localhost:5000/register", formData)
        .then((response) => {
          console.log(response.data);
          navigate("/login");
        })
        .catch((error) => {
          console.error("Error registering user:", error);
        });
      setErrorMessages([]);
      setFormData({
        first_name: "",
        middle_name: "",
        last_name: "",
        country_name: "",
        mobile_phone: "",
        work_phone: "",
        home_phone: "",
        email: "",
        password: "",
        verify_password: "",
      });
    } else {
      setErrorMessages(errors);
    }
  };

  return (
    <div>
      <Header />
      <div>
       <SideNav />
       </div>
       <div className={styles["main-content"]}>
      <MessageRibbon messageList={errorMessages} />
      <IndicatesRequired />
      <form onSubmit={handleSubmit} noValidate>
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
              label={"Password"}
              type={"password"}
              name={"password"}
              value={formData.password}
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
            <Input
              label={"Email Address"}
              type={"email"}
              name={"email"}
              value={formData.email}
              onChange={handleInputChange}
              required={true}
            />
            <Input
              label={"Verify Password"}
              type={"password"}
              name={"verify_password"}
              value={formData.verify_password}
              onChange={handleInputChange}
              required={true}
            />
          </div>
        </div>
        <div className={styles["button-ribbon"]}>
          <button>Register</button>
          <a href="http://localhost:3000/login">Need to login?</a>
        </div>
      </form>
      </div>
      <Footer />
    </div>
  );
};

export default Register;
