import React from "react";
import "./Send.css";

function Users({ user, isSelected, onClick }) {
  if (user.AID == localStorage.getItem("AID")) return;
  const userClassName = isSelected ? "user-cont selected" : "user-cont";

  return (
    <div className={userClassName} onClick={() => onClick(user)}>
      <p className="user-name">{user.NAME}</p>
      <p className="user-email">{user.EMAIL}</p>
    </div>
  );
}

export default Users;
