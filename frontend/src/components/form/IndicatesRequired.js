import React from "react";
import formStyles from "./Form.module.css";

const IndicatesRequired = () => {
  return (
    <div className={formStyles["required-content"]}>
      <span className={formStyles["required"]}>* </span>
      <span>Indicates Required</span>
    </div>
  );
};

export default IndicatesRequired;
