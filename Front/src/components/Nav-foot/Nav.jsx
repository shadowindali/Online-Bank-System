import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import { useUser } from "../Context";
import "./Nav.css";

function Nav() {
  const [loggedin, setloggedin] = useState(false);
  const [mobileview, setmobileview] = useState(false);

  let { type, setType } = useUser();

  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("PID");
    localStorage.removeItem("AID");
    localStorage.removeItem("Email");
    setloggedin(false);
    setType("");
    navigate("/home");
  };

  useEffect(() => {
    if (localStorage.getItem("AID")) setloggedin(true);
  }, [loggedin]);

  const adminLog = () => {
    if (type === "SuperAdmin" || type === "Admin") {
      navigate("/admin");
    }
  };

  return (
    <>
      {mobileview ? (
        <div className="mobile-view">
          <div
            className="background-mobile"
            onClick={() => setmobileview(false)}
          ></div>
          <ul>
            <li className="nav-item-mobile">
              <Link to="/home" onClick={() => setmobileview(false)}>
                Home
              </Link>
            </li>
            {loggedin ? (
              <ul style={{ alignItems: "center" }}>
                <li className="nav-item-mobile">
                  <Link to="/profile" onClick={() => setmobileview(false)}>
                    Profile
                  </Link>
                </li>
                <li className="nav-item-mobile">
                  <Link to="/send" onClick={() => setmobileview(false)}>
                    Send
                  </Link>
                </li>
                <li className="nav-item-mobile">
                  <Link to="/recieve" onClick={() => setmobileview(false)}>
                    Receive
                  </Link>
                </li>
                <li className="nav-item-mobile">
                  <Link
                    style={{ color: "red" }}
                    onClick={() => {
                      logout();
                      setmobileview(false);
                    }}
                  >
                    Logout
                  </Link>
                </li>
              </ul>
            ) : (
              ""
            )}
          </ul>
        </div>
      ) : (
        ""
      )}
      <div className="full-nav-container">
        <img onClick={adminLog} className="nav-logo" src="logo.png" />
        {loggedin ? (
          <>
            <div className="nav-items">
              <Link to="/home">Home </Link>
              <Link to="/profile">Profile </Link>
              <Link to="/send">Send</Link>
              <Link to="/recieve">Recieve</Link>
              <button onClick={logout} className="logout-button">
                logout
              </button>
            </div>
            <button
              className="menu-button-nav"
              onClick={() => setmobileview(true)}
            >
              <MenuIcon />
            </button>
          </>
        ) : (
          <button className="nav-button" onClick={() => navigate("/")}>
            Login/signup
          </button>
        )}
      </div>
    </>
  );
}

export default Nav;
