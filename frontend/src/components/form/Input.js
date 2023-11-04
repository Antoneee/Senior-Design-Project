import React from "react";
import styles from "./Form.module.css";

const Input = ({
  label,
  type,
  name,
  value,
  onChange,
  required,
  selectItems,
  multiple,
  size,
}) => {
  return (
    <>
      <label className={styles["display-block"]} htmlFor={name}>
        {required && <span className={styles["required"]}>* </span>}
        {label}
      </label>
      {type === "select" && (
        <select
          name={name}
          id={name}
          value={value}
          onChange={(e) => onChange(e)}
          required={required}
          multiple={multiple}
          size={size}
        >
          <option value="" disabled hidden>
            Select an option
          </option>
          {selectItems.map((selectItem, index) => (
            <option key={index} value={selectItem}>
              {selectItem}
            </option>
          ))}
        </select>
      )}
      {(type === "text" ||
        type === "email" ||
        type === "password" ||
        type === "time" ||
        type === "date" ||
        type === "checkbox") && (
        <input
          className={styles["display-block"]}
          type={type}
          name={name}
          id={name}
          value={value}
          onChange={(e) => onChange(e)}
          required={required}
        />
      )}
    </>
  );
};

export default Input;
