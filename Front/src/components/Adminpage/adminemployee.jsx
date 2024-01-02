import axios from "axios";
import React from "react";
import Swal from "sweetalert2";

function adminemployee({ employee }) {
  if (employee.PID == localStorage.getItem("PID")) return;

  const config = {
    headers: {
      "Content-type": "application/json",
    },
  };

  const makeemployee = async () => {
    Swal.fire({
      title: "Do you want to denote this account?",
      showCancelButton: true,
      confirmButtonText: "Save",
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          axios
            .patch(
              `${import.meta.env.VITE_API_URL}/user/makeemployee/`,
              { PID: employee.PID },
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

  const makeadmin = async () => {
    Swal.fire({
      title: "Do you want to promote this account?",
      showCancelButton: true,
      confirmButtonText: "Save",
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          axios
            .patch(
              `${import.meta.env.VITE_API_URL}/user/makeadmin/`,
              { PID: employee.PID },
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
    <div className="admin-employee">
      <p>{employee.NAME}</p>
      <p>
        <span style={{ color: "blue" }}>Age:</span>
        {employee.AGE}
      </p>
      <p>{employee.PHONENB}</p>
      <p>{employee.ROLE}</p>
      {employee.ROLE === "Admin" ? (
        <button
          onClick={makeemployee}
          style={{ width: "100px", background: "blue" }}
        >
          MakeEmployee
        </button>
      ) : employee.ROLE === "SuperAdmin" ? (
        ""
      ) : (
        <button onClick={makeadmin}>MakeAdmin</button>
      )}
    </div>
  );
}

export default adminemployee;
