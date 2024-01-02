import React, { useEffect, useState } from "react";
import Adminallusers from "./adminusers";
import Admintrans from "./admintrans";
import Adminemployee from "./adminemployee";
import { useNavigate } from "react-router-dom";
import "./Admin.css";
import axios from "axios";

function Admin() {
  const [users, setUsers] = useState([]);
  const [trans, setTrans] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [page, setPage] = useState(1);

  const navigate = useNavigate();

  const config = {
    headers: {
      "Content-type": "application/json",
    },
  };

  const getusers = async () => {
    await axios
      .get(`${import.meta.env.VITE_API_URL}/user/adminusers/`, config)
      .then((data) => {
        setUsers(data.data.data[0]);
      });
  };

  const gettrans = async () => {
    await axios
      .get(`${import.meta.env.VITE_API_URL}/user/alltransactions/`, config)
      .then((data) => {
        setTrans(data.data.data[0]);
      });
  };

  const getemlployee = async () => {
    await axios
      .get(`${import.meta.env.VITE_API_URL}/user/allemployees/`, config)
      .then((data) => {
        setEmployees(data.data.data[0]);
      });
  };

  useEffect(() => {
    getusers();
    gettrans();
    getemlployee();
  }, []);

  return (
    <div className="admin-page-full-cont">
      <button className="admin-back-button" onClick={() => navigate("/home")}>
        Back
      </button>
      <div className="admin-page-cont">
        <div className="admin-routes">
          <p onClick={() => setPage(1)}>Users</p>
          <p onClick={() => setPage(2)}>Transactions</p>
          <p onClick={() => setPage(3)}>Employees</p>
        </div>

        {page === 1 ? (
          <div className="admin-all-users">
            {users.map((user) => (
              <Adminallusers key={user.EMAIL} user={user} />
            ))}
          </div>
        ) : page === 2 ? (
          <div className="admin-all-transactions">
            {trans.map((tran) => (
              <Admintrans tran={tran} />
            ))}
          </div>
        ) : (
          <div className="admin-emloyee-con">
            {employees.map((employee, index) => (
              <Adminemployee employee={employee} key={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Admin;
