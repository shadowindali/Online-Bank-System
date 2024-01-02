import React, { useState } from "react";
import axios from "axios";
import { TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import Swal from "sweetalert2";

function Login() {
  const [switchlogin, setSwitchlogin] = useState(false);
  const [data, setData] = useState({ email: "", password: "" });
  const [error, setError] = useState(false);

  const navigate = useNavigate();

  if (localStorage.getItem("AID")) {
    window.location.href = "/home";
  }

  const switchbutton = () => {
    setSwitchlogin(!switchlogin);
    setError(false);
  };

  const changeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const config = {
    headers: {
      "Content-type": "application/json",
    },
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValid = emailRegex.test(data.email);

  const loginhandler = async () => {
    if (!data.email || !data.password) return;
    if (!isValid) return alert("enter a valid email");
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/user/login/`,
        data,
        config
      );
      if (response.data.status === "Welcome") {
        localStorage.setItem("AID", response.data.data[0].AID);
        localStorage.setItem("Email", response.data.data[0].EMAIL);
        localStorage.setItem("PID", response.data.data[0].PID);
        navigate("/home");
      } else if (response.data.status === "User is disabled!!") {
        Swal.fire({
          icon: "error",
          text: "User is disabled!!",
        });
      } else {
        setError(true);
      }
    } catch (error) {
      alert("something wrong happened");
    }
  };

  const signuphandler = async () => {
    if (!data.email || !data.password) return;
    if (!isValid) return alert("enter a valid email");
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/user/register/`,
        data,
        config
      );
      if (response.data.status === "User Created") {
        localStorage.setItem("AID", response.data.data.AID);
        localStorage.setItem("Email", response.data.data.EMAIL);
        localStorage.setItem("new", true);
        navigate("/addInfo");
      } else {
        setError(true);
      }
    } catch (error) {
      alert("something wrong happen");
    }
  };

  return (
    <div className="full-login-container">
      <div
        className="login-container"
        style={switchlogin ? { display: "none" } : { display: "flex" }}
      >
        <img className="image-con" src="logo.png" />
        <h1>Login</h1>
        <TextField
          onChange={changeHandler}
          label="Enter Email"
          type="email"
          variant="outlined"
          name="email"
        />
        <TextField
          onChange={changeHandler}
          label="Enter Password"
          variant="outlined"
          type="password"
          name="password"
        />
        <p
          style={
            error
              ? { display: "block", color: "red", fontSize: "1em" }
              : { display: "none" }
          }
        >
          Wrong email or password
        </p>
        <Button variant="outlined" onClick={loginhandler}>
          Login
        </Button>
        <p>
          You don't have account
          <Button style={{ color: "red" }} onClick={switchbutton}>
            Signup
          </Button>
        </p>
      </div>

      <div
        className="login-container"
        style={switchlogin ? { display: "flex" } : { display: "none" }}
      >
        <img className="image-con" src="logo.png" />
        <h1>Sign up</h1>
        <TextField
          onChange={changeHandler}
          label="Enter Email"
          type="email"
          variant="outlined"
          name="email"
        />
        <TextField
          onChange={changeHandler}
          label="Enter Password"
          variant="outlined"
          type="password"
          name="password"
        />
        <p
          style={
            error
              ? { display: "block", color: "red", fontSize: "1em" }
              : { display: "none" }
          }
        >
          Email has to be unique
        </p>
        <Button variant="outlined" onClick={signuphandler}>
          Sign up
        </Button>
        <p>
          You have account
          <Button style={{ color: "green" }} onClick={switchbutton}>
            Login
          </Button>
        </p>
      </div>
    </div>
  );
}

export default Login;
