import React from "react";
import styles from "./Header.module.css";
import mainLogo from "../../assets/logo.png";
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
      <div className={styles["left-aligned"]}>
        {/* <div id="logo">
          <img src={mainLogo} alt="Logo" />
        </div> */}
        <h1>uARexpert</h1>
      </div>
      {authState.status && <h2>{authState.name}</h2>}
      {authState.status && <button onClick={logout}>Logout</button>}
    </div>
  );
};

export default Header;
