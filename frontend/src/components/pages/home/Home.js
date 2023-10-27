import React, { useEffect, useContext } from "react";
import SideNav from "../../sidenav/SideNav";
import Footer from "../../footer/Footer";
import Header from "../../header/Header";
import styles from "./Home.module.css";
import { AuthContext } from "../../../helpers/AuthContext";
import Unauthorized from "../error/Unauthorized";

const Home = () => {
  const { authState } = useContext(AuthContext);

  return authState.status ? (
    <div>
      <Header />
      <SideNav />
      <Footer />
    </div>
  ) : (
    <Unauthorized />
  );
};

export default Home;
