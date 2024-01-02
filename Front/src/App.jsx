import { useState } from "react";
import Home from "./components/Homepage/Hom";
import Login from "./components/Login/Login";
import AddInfo from "./components/AddInfo/addinfo";
import { Routes, Route, useNavigate } from "react-router-dom";
import Profile from "./components/Profile/Profile";
import Send from "./components/Send/Send";
import Reciever from "./components/Reciever/Reciever";
import Nav from "./components/Nav-foot/Nav";
import Admin from "./components/Adminpage/Admin";

const App = () => {
  const navigate = useNavigate();
  const currentPath = window.location.pathname;

  return (
    <div>
      {currentPath !== "/" &&
        currentPath !== "/admin" &&
        currentPath !== "/addInfo" && <Nav />}

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/addInfo" element={<AddInfo />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/send" element={<Send />} />
        <Route path="/recieve" element={<Reciever />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </div>
  );
};

export default App;
