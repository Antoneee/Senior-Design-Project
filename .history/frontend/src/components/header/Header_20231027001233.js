import React from "react";
import styles from "./Header.module.css";
import { useContext } from "react";
import { AuthContext } from "../../helpers/AuthContext";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { authState, setAuthState } = useContext(AuthContext);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("accessToken");
    setAuthState({
      id: 0,
      name: "",
      email: "",
      status: false,
    });
    navigate("/login");
  };

  return (
    <div className={styles["header"]}>
      <h1>uARexpert</h1>
      {authState.status && <h2>{authState.name}</h2>}
      {authState.status && <button onClick={logout}>Logout</button>}
    </div>
  );
};

export default Header;
