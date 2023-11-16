import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import axios from "axios";
import Footer from "../../footer/Footer";
import Header from "../../header/Header";
import Input from "../../form/Input";
import formStyles from "../../form/Form.module.css";
import editProfileStyles from "./EditProfile.module.css";
import IndicatesRequired from "../../form/IndicatesRequired";
import MessageRibbon from "../../form/MessageRibbon";
import { AuthContext } from "../../../helpers/AuthContext";

const EditUserProfile = () => {
  const { userId } = useParams();
  const { authState } = useContext(AuthContext);

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

  const [deleteModal, setDeleteModal] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:5000/countries")
      .then((response) => {
        setCountryCodes(response.data.countries);
      })
      .catch((error) => {
        console.error("Error fetching country codes:", error);
      });
    axios
      .get(`http://localhost:5000/users/${userId}`)
      .then((response) => {
        const data = response.data.user[0];

        const country = countryCodes.find(
          (country) => country.id === data.country_id
        );
        if (country) {
          setFormData({
            first_name: data.first_name,
            middle_name: data.middle_name !== "null" ? data.middle_name : "",
            last_name: data.last_name,
            country_name: country.name,
            mobile_phone: data.mobile_phone,
            work_phone: data.work_phone !== "null" ? data.work_phone : "",
            home_phone: data.home_phone !== "null" ? data.home_phone : "",
            email: data.email,
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
      });
  }, [countryCodes.length]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
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

  const handleDeleteModal = () => {
    setDeleteModal(true);
  };

  const confirmDelete = () => {
    axios
      .delete(`http://localhost:5000/users/${authState.id}`)
      .then((response) => {
        navigate("/login");
      })
      .catch((error) => {
        console.error("Error deleting event:", error);
      });
  };

  const declineDelete = () => {
    setDeleteModal(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

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
    };

    // Validation for required fields
    const requiredFields = [
      "first_name",
      "last_name",
      "country_name",
      "mobile_phone",
      "email",
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

    if (errors.length === 0) {
      axios
        .put(`http://localhost:5000/users/${userId}`, formData)
        .then((response) => {
          navigate("/");
        })
        .catch((error) => {
          console.error("Error updating user:", error);
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
      <div
        className={`${formStyles["form-component"]} ${editProfileStyles["edit-profile-component"]}`}
      >
        <h1 className={formStyles["form-heading"]}>Edit Profile</h1>
        <MessageRibbon messageList={errorMessages} />
        <IndicatesRequired />
        <form onSubmit={handleSubmit} noValidate>
          <div className={formStyles["form-container"]}>
            <div className={formStyles["form-2col-container"]}>
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
            </div>
            <div className={formStyles["form-2col-container"]}>
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
                selectItems={countryCodes.map((country) => country.name)}
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
            </div>
          </div>
          <div className={formStyles["button-ribbon"]}>
            <button className={editProfileStyles["save-btn"]} type="submit">
              Save
            </button>
            <button
              className={editProfileStyles["unregister-btn"]}
              type="button"
              onClick={handleDeleteModal}
            >
              Unregister
            </button>
            <Link className={formStyles["redirect-link"]} to="/">
              Cancel
            </Link>
          </div>
        </form>
        {deleteModal && (
          <div className={formStyles["modal"]}>
            <div className={formStyles["modal-content"]}>
              <h2 className={formStyles["modal-heading"]}>Are you sure?</h2>
              <p className={formStyles["modal-text"]}>
                You are about to permanently delete your user profile. This
                action cannot be undone.
              </p>
              <button onClick={confirmDelete}>Yes</button>
              <button onClick={declineDelete}>No</button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default EditUserProfile;
