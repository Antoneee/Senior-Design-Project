import React, { useEffect, useContext } from "react";
import SideNav from "../../sidenav/SideNav";
import Footer from "../../footer/Footer";
import Header from "../../header/Header";
import styles from "./Home.module.css";
import { AuthContext } from "../../../helpers/AuthContext";
import Unauthorized from "../error/Unauthorized";
import homeImg from "../../../assets/home.jpg";

const Home = () => {
  const { authState } = useContext(AuthContext);

  return authState.status ? (
    <div className={styles["home-page"]}>
      <SideNav />
      <div className={styles["content-container"]}>
        <Header />
        <div className={styles["home-page-img-container"]}>
          <img className={styles["home-page-img"]} src={homeImg} />
        </div>
        <Footer />
      </div>
    </div>
  ) : (
    <Unauthorized />
  );
};

export default Home;
