import React from "react";
import Nav from "../Nav-foot/Nav";
import "./Home.css";
import { useNavigate } from "react-router-dom";

function Hom() {
  const navigate = useNavigate();
  return (
    <>
      <div className="home-full-container">
        <div className="empty-space"></div>
        <div className="home-content">
          <h1>Online Banking</h1>
          <p>Its today or never</p>
          <p
            onClick={() => navigate("/")}
            style={{
              textShadow: "10px 10px 2px black",
              cursor: "pointer",
            }}
          >
            Join Us
          </p>
        </div>
      </div>
    </>
  );
}

export default Hom;
