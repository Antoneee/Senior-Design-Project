import React from "react";
import formStyles from "./Form.module.css";

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
      <label className={formStyles["form-label"]} htmlFor={name}>
        {required && <span className={formStyles["required"]}>* </span>}
        {label}
      </label>
      {type === "select" && (
        <select
          className={formStyles["form-select"]}
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
          className={formStyles["form-input"]}
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
