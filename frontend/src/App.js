import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EditProfile from "./components/pages/edit-user-profile/EditProfile";
import Login from "./components/pages/login/Login";
import Home from "./components/pages/home/Home";
import Register from "./components/pages/registration/Register";
import { AuthContext } from "./helpers/AuthContext";
import { useState, useEffect } from "react";
import axios from "axios";
import NotFound from "./components/pages/error/NotFound";
import Calendar from "./components/pages/calendar/Calendar";
import RemoteViewing from "./components/pages/remote-viewing/RemoteViewing";

function App() {
  const [authState, setAuthState] = useState({
    id: 0,
    name: "",
    email: "",
    status: false,
  });

  useEffect(() => {
    axios
      .get("http://localhost:5000/auth", {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        if (response.data.error) {
          setAuthState({
            ...authState,
            status: false,
          });
          console.log(authState.status);
        } else {
          setAuthState({
            id: response.data.id,
            name: response.data.name,
            email: response.data.email,
            status: true,
          });
        }
      });
  }, [authState]);

  return (
    <AuthContext.Provider value={{ authState, setAuthState }}>
      <Router>
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/register" exact element={<Register />} />
          <Route path="/login" exact element={<Login />} />
          <Route path="/profile/edit" exact element={<EditProfile />} />
          <Route path="/calendar" exact element={<Calendar />} />
          <Route path="/remote-viewing" exact element={<RemoteViewing />} />
          <Route path="*" exact element={<NotFound />} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
