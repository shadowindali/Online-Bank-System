const express = require("express");
const {
  loginController,
  registerController,
  addinfoController,
  getdata,
  getTransactions,
  updateme,
  changepassword,
  getcustomerforsend,
  sendrequest,
  recievedsendrequest,
  deletereq,
  recieverequest,
  adminusers,
  disableuser,
  enableuser,
  alltransactions,
  allemployees,
  makeadmin,
  makeemployee,
} = require("../Controller/userController");

const Router = express.Router();

Router.post("/login", loginController);
Router.post("/register", registerController);
Router.post("/addinfo", addinfoController);
Router.patch("/updateme", updateme);
Router.patch("/changepassword", changepassword);
Router.get("/getcustomerforsend", getcustomerforsend);
Router.post("/sendrequest", sendrequest);
Router.post("/recieverequest", recieverequest);

Router.get("/adminusers", adminusers);
Router.get("/alltransactions", alltransactions);
Router.get("/allemployees", allemployees);
Router.patch("/disableuser", disableuser);
Router.patch("/enableuser", enableuser);
Router.patch("/makeadmin", makeadmin);
Router.patch("/makeemployee", makeemployee);

Router.delete("/deletereq/:id", deletereq);
Router.get("/getdata/:id", getdata);
Router.get("/gettransactions/:id", getTransactions);
Router.get("/recievedsendrequest/:id", recievedsendrequest);

module.exports = Router;
