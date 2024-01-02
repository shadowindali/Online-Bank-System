import React, { useEffect, useState } from "react";
import Req from "./req";
import Users from "./users";
import axios from "axios";
import LoaderIcon from "react-loader-icon";
import { IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Swal from "sweetalert2";
import "./Send.css";

function Send() {
  const [users, setUsers] = useState([]);
  const [requests, setRequsets] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    Sender: localStorage.getItem("AID"),
    Reciever: "",
    Amount: "",
  });

  if (!localStorage.getItem("AID")) {
    window.location.href = "/";
  }

  const fillamount = (e) => {
    setData((prevData) => ({
      ...prevData,
      Amount: e.target.value ? e.target.value : "",
    }));
  };

  const config = {
    headers: {
      "Content-type": "application/json",
    },
  };

  const getusers = async () => {
    await axios
      .get(`${import.meta.env.VITE_API_URL}/user/getcustomerforsend/`, config)
      .then(({ data }) => {
        setUsers(data.data);
      });
  };

  const filterUsers = () => {
    return users.filter(
      (user) =>
        user.NAME.toLowerCase().includes(searchInput.toLowerCase()) ||
        user.EMAIL.toLowerCase().includes(searchInput.toLowerCase())
    );
  };

  const getrequests = async () => {
    axios
      .get(
        `${
          import.meta.env.VITE_API_URL
        }/user/recievedsendrequest/${localStorage.getItem("AID")}`,
        config
      )
      .then(({ data }) => {
        setRequsets(data.data[0]);
      });
  };

  useEffect(() => {
    getusers();
    getrequests();
    setTimeout(() => {
      setLoaded(true);
    }, 400);
  }, []);

  const handleUserClick = (user) => {
    setSelectedUser((prevSelectedUser) =>
      prevSelectedUser === user ? null : user
    );
    setData((prevData) => ({
      ...prevData,
      Reciever: user ? user.AID : "",
    }));
  };

  const maketrans = async () => {
    setError(false);
    setSuccess(false);
    setLoading(true);

    if (data.Reciever === "") {
      Swal.fire({
        icon: "error",
        text: "Choose Reciever!",
      });
      return;
    }

    if (data.Amount === "") {
      Swal.fire({
        icon: "error",
        text: "Set Amount!",
      });
      return;
    }

    if (data.Amount < 1) {
      Swal.fire({
        icon: "error",
        text: "Amount Can't be in negative!",
      });
      return;
    }

    Swal.fire({
      title: "Do you want to transfer money?",
      showCancelButton: true,
      confirmButtonText: "Save",
    }).then((result) => {
      console.log(data);
      if (result.isConfirmed) {
        axios
          .post(
            `${import.meta.env.VITE_API_URL}/user/sendrequest/`,
            data,
            config
          )
          .then(({ data }) => {
            if (data.message === "Insufficient funds in the source account.") {
              setLoading(false);
              setError(true);
            }
            if (data.message === "Money transferred successfully.") {
              setLoading(false);
              setSuccess(true);
            }
          });
      }
    });
  };

  if (loaded)
    return (
      <>
        <div className="full-send-container">
          <div className="empty-space"></div>
          <div className="send-container">
            <div className="allusers">
              <div className="ussearch white">
                <IconButton>
                  <SearchIcon className="darkicon" />
                </IconButton>
                <input
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search"
                />
              </div>
              {filterUsers().map((user) => (
                <Users
                  key={user.AID}
                  user={user}
                  isSelected={selectedUser === user}
                  onClick={handleUserClick}
                />
              ))}
            </div>

            <div className="right-side-send">
              <div className="balance-to-send-cont">
                <h1>Amount to send:</h1>
                <input type="number" placeholder="USD" onChange={fillamount} />
                <button onClick={maketrans}>Send</button>
              </div>

              <div className="status-of-transaction">
                {/* LOADING */}
                {loading ? <LoaderIcon type={"balls"} size={200} /> : ""}

                {/* SUCCESS */}
                {success ? (
                  <h1 style={{ fontSize: "30px", color: "Green" }}>
                    Successfully Sent 🤝
                  </h1>
                ) : (
                  ""
                )}

                {/* ERROR */}
                {error ? (
                  <h1 style={{ fontSize: "30px", color: "red" }}>
                    No enough money ❌
                  </h1>
                ) : (
                  ""
                )}
              </div>
            </div>

            <div style={{ marginLeft: "0" }} className="allusers req-full-cont">
              {requests.map((req) => (
                <Req key={req.RID} req={req} />
              ))}
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

export default Send;
