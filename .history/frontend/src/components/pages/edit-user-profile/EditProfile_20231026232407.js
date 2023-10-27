import React, { useState } from "react";
import Footer from "../../footer/Footer";
import Header from "../../header/Header";
import Input from "../../form/Input";
import styles from "./EditProfile.module.css";
import IndicatesRequired from "../../form/IndicatesRequired";
import MessageRibbon from "../../form/MessageRibbon";

const EditProfile = () => {
  return (
    <div>
      <Header />
      <IndicatesRequired />
      <h1>Edit User Profile Page</h1>
      <Footer />
    </div>
  );
};

export default EditProfile;
