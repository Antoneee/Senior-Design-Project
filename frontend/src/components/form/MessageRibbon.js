import React from "react";
import formStyles from "../form/Form.module.css";

const MessageRibbon = ({ messageList }) => {
  return (
    <>
      <ul className={formStyles["form-errors-container"]}>
        {messageList.map((message, index) => {
          return (
            <li className={formStyles["form-errors-list"]} key={index}>
              {message}
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default MessageRibbon;
