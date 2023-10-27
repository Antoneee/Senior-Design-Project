import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Footer from "../../footer/Footer";
import Header from "../../header/Header";
import Input from "../../form/Input";
import styles from "./Register.module.css";
import IndicatesRequired from "../../form/IndicatesRequired";
import MessageRibbon from "../../form/MessageRibbon";

const isValidEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
};

const isValidPhoneNumber = (phoneNumber) => {
    const phonePattern = /^[0-9]{10}$/;
    return phonePattern.test(phoneNumber);
};

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // ... the rest of the fields
  });
  const [errorMessages, setErrorMessages] = useState([]);
  const [countryCodes, setCountryCodes] = useState([]);

  useEffect(() => {
    const fetchCountryCodes = async () => {
      try {
        const response = await axios.get("http://localhost:5000/countries");
        setCountryCodes(response.data.countries);
      } catch (error) {
        console.error("Error fetching country codes:", error);
      }
    };
    fetchCountryCodes();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const errors = [];
    // ... all your validation logic

    if (errors.length === 0) {
      try {
        const response = await axios.post("http://localhost:5000/register", formData);
        navigate("/login");
        setFormData({
          // ... reset fields
        });
      } catch (error) {
        console.error("Error registering user:", error);
      }
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
        {/* ... all your inputs */}
        <div className={styles["button-ribbon"]}>
          <button>Register</button>
          <Link to="/login">Need to login?</Link>
        </div>
      </form>
      <Footer />
    </div>
  );
};

export default Register;
