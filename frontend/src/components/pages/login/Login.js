import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "../../footer/Footer";
import Header from "../../header/Header";
import Input from "../../form/Input";
import styles from "./Login.module.css";
import IndicatesRequired from "../../form/IndicatesRequired";
import MessageRibbon from "../../form/MessageRibbon";
import { AuthContext } from "../../../helpers/AuthContext";

const Login = () => {
  const navigate = useNavigate();

  const { setAuthState } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errorMessages, setErrorMessages] = useState([]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const isValidEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const errors = [];

    const fieldToLablesMap = {
      email: "Email address",
      password: "Password",
    };

    // Validation for required fields
    const requiredFields = ["email", "password"];

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        errors.push(`${fieldToLablesMap[field]} is required.`);
      }
    });

    // Validation for field lengths
    const fieldsToCheckLength = ["email", "password"];
    fieldsToCheckLength.forEach((field) => {
      if (formData[field] && formData[field].length > 50) {
        errors.push(
          `${fieldToLablesMap[field]} must be 50 characters or less.`
        );
      }
    });

    // Validation for email
    if (formData.email && !isValidEmail(formData.email)) {
      errors.push("Invalid email address.");
    }

    if (errors.length === 0) {
      axios
        .post("http://localhost:5000/login", formData)
        .then((response) => {
          if (!response.data.error) {
            localStorage.setItem("accessToken", response.data.accessToken);
            setAuthState({
              id: response.data.id,
              name: response.data.name,
              email: response.data.email,
              status: true,
            });
            setErrorMessages([]);
            setFormData({
              email: "",
              password: "",
            });
            navigate("/");
          }
        })
        .catch((error) => {
          errors.push("Invalid email and password combination.");
          setErrorMessages(errors);
          console.error("Error registering user:", error);
        });
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
        <div className={styles["form-container"]}>
          <div className={styles["form-sub-container"]}>
            <Input
              label={"Email Address"}
              type={"email"}
              name={"email"}
              value={formData.email}
              onChange={handleInputChange}
              required={true}
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
        </div>
        <div className={styles["button-ribbon"]}>
          <button>Login</button>
          <a href="http://localhost:3000/register">Need to register?</a>
        </div>
      </form>
      <Footer />
    </div>
  );
};
export default Login;
