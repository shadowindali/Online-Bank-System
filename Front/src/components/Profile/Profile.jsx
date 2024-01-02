import React, { useEffect, useState } from "react";
import axios from "axios";
import { TextField } from "@mui/material";
import Swal from "sweetalert2";
import "./Profile.css";

import DoneIcon from "@mui/icons-material/Done";
import TransCard from "./TransCard";
import { useUser } from "../Context";

function Profile() {
  const [userdata, setUserdata] = useState({});
  const [newdata, setNewdata] = useState({ PID: localStorage.getItem("PID") });
  const [newpassword, setNewpassword] = useState({
    PID: localStorage.getItem("PID"),
  });

  let { setType } = useUser();

  if (!localStorage.getItem("AID")) {
    window.location.href = "/";
  }

  const [trans, setTrans] = useState([]);

  const [loaded, setLoaded] = useState(false);

  const config = {
    headers: {
      "Content-type": "application/json",
    },
  };

  const filldata = (e) => {
    setNewdata({ ...newdata, [e.target.name]: e.target.value });
  };

  const fillnewpassword = (e) => {
    setNewpassword({ ...newpassword, [e.target.name]: e.target.value });
  };

  // GET DATA
  const getdata = async () => {
    await axios
      .get(
        `${import.meta.env.VITE_API_URL}/user/getdata/${localStorage.getItem(
          "AID"
        )}`,
        config
      )
      .then((data) => {
        setUserdata(data.data.data);
        if (data.data.type) {
          setType(data.data.type.ROLE);
        }
      });

    await axios
      .get(
        `${
          import.meta.env.VITE_API_URL
        }/user/gettransactions/${localStorage.getItem("AID")}`,
        config
      )
      .then((data) => {
        const array = data.data.data;
        const reversedArray = array.reverse();
        setTrans(reversedArray);
      });
  };

  useEffect(() => {
    getdata();
    setTimeout(() => {
      setLoaded(true);
    }, 400);
  }, []);

  // CHANGE DATA
  const updateme = async () => {
    Swal.fire({
      title: "Do you want to save the changes?",
      showCancelButton: true,
      confirmButtonText: "Save",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .patch(
            `${import.meta.env.VITE_API_URL}/user/updateme`,
            newdata,
            config
          )
          .then(() => {
            Swal.fire("Saved!", "", "success");
          });
      }
    });
  };

  // CHANGE PASSWORD
  const chanegpassword = async () => {
    if (newpassword.newpassword !== newpassword.confirmpassword) {
      Swal.fire({
        icon: "error",
        text: "Confirm password is different!",
      });
      return;
    }
    Swal.fire({
      title: "Do you want to save the changes?",
      showCancelButton: true,
      confirmButtonText: "Save",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .patch(
            `${import.meta.env.VITE_API_URL}/user/changepassword`,
            newpassword,
            config
          )
          .then((data) => {
            if (data.data.data[0].Status === "Current password is incorrect")
              Swal.fire({
                icon: "error",
                text: "Current Password is wrong!!",
              });
            else {
              Swal.fire("Saved!", "", "success");
            }
          });
      }
    });
  };

  if (loaded)
    return (
      <>
        <div className="full-profile-container">
          <div className="empty-space"></div>
          <div className="container-profile">
            <div className="userinfo">
              <TextField
                className="small-inputfield"
                label="Name"
                variant="outlined"
                name="name"
                defaultValue={userdata.NAME}
                onChange={filldata}
              />
              <TextField
                className="small-inputfield"
                label="Age"
                variant="outlined"
                name="age"
                defaultValue={userdata.AGE}
                onChange={filldata}
              />
              <TextField
                className="small-inputfield"
                label="Phone number"
                variant="outlined"
                name="phonenb"
                defaultValue={userdata.PHONENB}
                onChange={filldata}
              />
              <TextField
                className="large-inputfield"
                label="Address"
                variant="outlined"
                name="address"
                defaultValue={userdata.ADDRESS}
                onChange={filldata}
              />
              <TextField
                className="small-inputfield"
                label="Email"
                variant="outlined"
                name="email"
                value={userdata.EMAIL}
              />
              <button
                className="done-button"
                style={{ background: "blue", color: "white" }}
                onClick={updateme}
              >
                <DoneIcon />
              </button>
            </div>
            <div className="profilepass">
              <TextField
                className="small-inputfield"
                label="Current Password"
                variant="outlined"
                name="currentpassword"
                onChange={fillnewpassword}
              />
              <TextField
                className="small-inputfield"
                label="New Password"
                variant="outlined"
                name="newpassword"
                onChange={fillnewpassword}
              />
              <TextField
                className="small-inputfield"
                label="Confirm Password"
                variant="outlined"
                name="confirmpassword"
                onChange={fillnewpassword}
              />
              <button className="done-button" onClick={chanegpassword}>
                <DoneIcon />
              </button>
            </div>
            <div className="general-data">
              <h1>
                Balance: <span>{userdata.BALANCE}</span>$
              </h1>
              <br />
              <h1>Recent Transactions:</h1>
            </div>
            <div className="Transactions-container">
              {trans.map((tran, index) => {
                return (
                  <TransCard tran={tran} name={userdata.NAME} key={index} />
                );
              })}
            </div>
          </div>
        </div>
      </>
    );
  else {
    return (
      <div className="loading-container">
        <div className="loading">
          <span>Loading</span>
        </div>
      </div>
    );
  }
}

export default Profile;
