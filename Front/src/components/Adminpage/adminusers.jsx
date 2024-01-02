import axios from "axios";
import React from "react";
import Swal from "sweetalert2";

function adminusers({ user }) {
  if (user.AID == localStorage.getItem("AID")) return;

  const config = {
    headers: {
      "Content-type": "application/json",
    },
  };

  const disableuser = async () => {
    Swal.fire({
      title: "Do you want to disable this account?",
      showCancelButton: true,
      confirmButtonText: "Save",
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          axios
            .patch(
              `${import.meta.env.VITE_API_URL}/user/disableuser/`,
              { AID: user.AID },
              config
            )
            .then(async () => {
              await Swal.fire("Done!", "", "success");
              location.reload();
            });
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

  const enableuser = async () => {
    Swal.fire({
      title: "Do you want to enable this account?",
      showCancelButton: true,
      confirmButtonText: "Save",
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          axios
            .patch(
              `${import.meta.env.VITE_API_URL}/user/enableuser/`,
              { AID: user.AID },
              config
            )
            .then(async () => {
              await Swal.fire("Done!", "", "success");
              location.reload();
            });
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

  return (
    <div className="admin-users">
      <p>{user.NAME}</p>
      <p>Age: {user.AGE}</p>
      <p>Balance: {user.BALANCE}$</p>
      <p>{user.EMAIL}</p>
      <p>{user.STATUS}</p>
      {user.STATUS === "active" ? (
        <button onClick={disableuser}>Disable</button>
      ) : (
        <button style={{ backgroundColor: "blue" }} onClick={enableuser}>
          Enable
        </button>
      )}
    </div>
  );
}

export default adminusers;
