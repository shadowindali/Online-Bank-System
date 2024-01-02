import React, { useEffect, useState } from "react";
import "./addinfo.css";
import axios from "axios";
import { TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [data, setData] = useState({
    name: "",
    age: "",
    phonenb: "",
    address: "",
    AID: localStorage.getItem("AID"),
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("new") === null) {
      navigate("/");
    }
  });

  const changeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const config = {
    headers: {
      "Content-type": "application/json",
    },
  };

  const addInfo = async () => {
    if (!data.name || !data.age || !data.phonenb || !data.address || !data.AID)
      return;
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/user/addinfo/`,
        data,
        config
      );
      if (response.data.status === "Info Added") {
        localStorage.setItem("PID", response.data.data);
        localStorage.removeItem("new");
        navigate("/home");
      } else {
        alert("error happened");
      }
    } catch (error) {
      alert("something wrong happened");
    }
  };

  return (
    <div className="profile-full-container">
      <div className="profile-container">
        <div className="profile-head">
          <h1>ADD INFO</h1>
        </div>
        <div className="profile-data-container">
          <div className="user-data-container">
            <TextField
              className="small-inputfield-add"
              label="Name"
              variant="outlined"
              name="name"
              onChange={changeHandler}
            />
            <TextField
              className="small-inputfield-add"
              label="Age"
              variant="outlined"
              name="age"
              onChange={changeHandler}
            />
            <TextField
              className="small-inputfield-add"
              label="Phone Number"
              variant="outlined"
              name="phonenb"
              onChange={changeHandler}
            />
            <TextField
              className="small-inputfield-add"
              label="Address"
              variant="outlined"
              name="address"
              onChange={changeHandler}
            />
            <button onClick={addInfo} className="save-button">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
// }

export default Profile;
