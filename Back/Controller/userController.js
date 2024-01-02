const express = require("express");
const sql = require("mssql");
const { pool } = require("../Database");

const loginController = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool
      .request()
      .input("email", sql.VarChar, email)
      .input("password", sql.VarChar, password)
      .query(
        "SELECT * FROM ACCOUNT WHERE EMAIL = @email AND PASSWORD = @password COLLATE Latin1_General_CS_AS"
      );

    if (result.recordset[0].STATUS === "disabled") {
      res.status(201).json({
        status: "User is disabled!!",
      });
    }
    if (result.recordset.length == 0) {
      res.status(201).json({
        status: "Wrong user",
      });
    } else {
      res.status(201).json({
        status: "Welcome",
        data: result.recordsets[0],
      });
    }
  } catch (error) {
    console.error("Error while querying the database:", error);
  }
};

const registerController = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool
      .request()
      .input("email", sql.VarChar, email)
      .input("password", sql.VarChar, password)
      .query(
        "INSERT INTO ACCOUNT (EMAIL,BALANCE,PASSWORD,DATEOPENED,STATUS) OUTPUT INSERTED.AID,INSERTED.EMAIL VALUES(@email,0,@password,GETDATE(),'active')"
      );

    const data = result.recordsets[0][0];

    res.status(201).json({
      status: "User Created",
      data,
    });
  } catch (error) {
    res.status(200).json({
      status: "User email has to be unique",
    });
    console.log(error);
  }
};

const addinfoController = async (req, res) => {
  const { name, age, phonenb, address, AID } = req.body;

  try {
    const result = await pool
      .request()
      .input("name", sql.VarChar, name)
      .input("age", sql.Numeric, age)
      .input("phonenb", sql.Numeric, phonenb)
      .input("address", sql.VarChar, address)
      .query(
        "INSERT INTO PERSON (NAME,AGE,PHONENB,ADDRESS) OUTPUT INSERTED.PID VALUES(@name,@age,@phonenb,@address)"
      );

    const data = result.recordsets[0][0].PID;

    pool
      .request()
      .input("pid", sql.Numeric, data)
      .query(`INSERT INTO CUSTOMER (PID) VALUES (@pid)`);

    const result_Acc = await pool
      .request()
      .input("aid", sql.Numeric, AID)
      .input("pid", sql.Numeric, data)
      .query("UPDATE ACCOUNT SET PID = @pid WHERE AID = @aid");

    res.status(201).json({
      status: "Info Added",
      data,
    });
  } catch (error) {
    res.status(400).json({
      status: "something error happened",
    });
    console.log(error);
  }
};

const getdata = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await pool
      .request()
      .input("aid", sql.Numeric, id)
      .query(
        "select t1.PID,NAME,AGE,PHONENB,EMAIL,ADDRESS,BALANCE from ACCOUNT t1 INNER JOIN PERSON t2 ON t1.PID = t2.PID WHERE AID = @aid"
      );

    const pid = result.recordset[0].PID;

    const ifAdmin = await pool
      .request()
      .input("pid", sql.Numeric, pid)
      .query("SELECT * FROM EMPLOYEE WHERE PID = @pid ");

    const type = ifAdmin.recordset[0];

    const data = result.recordsets[0][0];

    res.status(201).json({
      status: "Info Sent",
      data,
      type,
    });
  } catch (error) {
    res.status(400).json({
      status: "something error happened",
    });
    console.log(error);
  }
};

const getTransactions = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await pool
      .request()
      .input("aid", sql.Numeric, id)
      .query(
        `SELECT
        TRANSACTIONS.*,
        ACCOUNT.AID AS SenderAID,
		    RECEIVER_ACCOUNT.AID AS ReceiverAID,
        COALESCE(SENDER_PERSON.NAME, 'Unset') AS SenderName,
        COALESCE(RECEIVER_PERSON.NAME, 'Unset') AS ReceiverName
      FROM TRANSACTIONS
      INNER JOIN ACCOUNT ON ACCOUNT.AID = TRANSACTIONS.SENDER 
	    LEFT JOIN ACCOUNT AS RECEIVER_ACCOUNT ON RECEIVER_ACCOUNT.AID = TRANSACTIONS.RECIEVER
      LEFT JOIN PERSON SENDER_PERSON ON SENDER_PERSON.PID = ACCOUNT.PID
      LEFT JOIN PERSON RECEIVER_PERSON ON RECEIVER_PERSON.PID = RECEIVER_ACCOUNT.PID
      WHERE SENDER = @aid OR RECIEVER = @aid;`
      );

    const data = result.recordsets[0];

    res.status(201).json({
      status: "Info Sent",
      data,
    });
  } catch (error) {
    res.status(400).json({
      status: "something error happened",
    });
    console.log(error);
  }
};

const updateme = async (req, res) => {
  const { name, age, phonenb, address, PID } = req.body;
  try {
    const result = await pool
      .request()
      .input("PID", sql.Numeric, PID)
      .input("name", sql.VarChar, name)
      .input("age", sql.Numeric, age)
      .input("phonenb", sql.Numeric, phonenb)
      .input("address", sql.VarChar, address)
      .query(
        `UPDATE PERSON
        SET 
          NAME = COALESCE(@name, NAME),
          AGE = COALESCE(@age, AGE),
          PHONENB = COALESCE(@phonenb, PHONENB),
          ADDRESS = COALESCE(@address, ADDRESS)
        WHERE PID = @PID`
      );

    const data = result.recordsets[0];

    res.status(201).json({
      status: "Info Sent",
      data,
    });
  } catch (error) {
    res.status(400).json({
      status: "something error happened",
    });
    console.log(error);
  }
};

const changepassword = async (req, res) => {
  const { PID, currentpassword, newpassword } = req.body;
  try {
    const result = await pool
      .request()
      .input("PID", sql.Numeric, PID)
      .input("currentpassword", sql.VarChar, currentpassword)
      .input("newpassword", sql.VarChar, newpassword)
      .query(`EXEC UpdatePassword @PID,@currentpassword,@newpassword`);

    const data = result.recordsets[0];

    res.status(201).json({
      data,
    });
  } catch (error) {
    res.status(400).json({
      status: "something error happened",
    });
    console.log(error);
  }
};

const getcustomerforsend = async (req, res) => {
  try {
    const result = await pool.request().query(`select NAME,EMAIL,AID
      from ACCOUNT A
      INNER JOIN PERSON P ON A.PID = P.PID
      INNER JOIN CUSTOMER C ON C.PID = A.PID`);

    const data = result.recordsets[0];

    res.status(201).json({
      data,
    });
  } catch (error) {
    res.status(400).json({
      status: "something error happened",
    });
    console.log(error);
  }
};

const sendrequest = async (req, res) => {
  const { Sender, Reciever, Amount } = req.body;

  try {
    const result = await pool
      .request()
      .input("sender", sql.Numeric, Sender)
      .input("reciever", sql.Numeric, Reciever)
      .input("amount", sql.Numeric, Amount)
      .output("message", sql.VarChar)
      .query(`exec TransferMoney @sender,@reciever,@amount,@message out`);

    const message = result.output.message;

    res.status(201).json({
      message,
    });
  } catch (error) {
    res.status(400).json({
      status: "something error happened",
    });
    console.log(error);
  }
};

const recievedsendrequest = async (req, res) => {
  const AID = req.params.id;

  try {
    const result = await pool.request().input("aid", sql.Numeric, AID)
      .query(`SELECT R.*, P_SENDER.NAME AS SENDER_NAME
      FROM REQUESTS R
      JOIN ACCOUNT A_SENDER ON R.SENDER = A_SENDER.AID
      JOIN PERSON P_SENDER ON A_SENDER.PID = P_SENDER.PID
      WHERE
          R.TYPE = 'Send' AND
          R.RECEIVER = @aid;`);

    const data = result.recordsets;

    res.status(201).json({
      data,
    });
  } catch (error) {
    res.status(400).json({
      status: "something error happened",
    });
    console.log(error);
  }
};

const deletereq = async (req, res) => {
  const RID = req.params.id;

  try {
    const result = await pool
      .request()
      .input("rid", sql.Numeric, RID)
      .query(`Delete from REQUESTS where RID = @rid`);

    const data = result.recordsets;

    res.status(201).json({
      data,
    });
  } catch (error) {
    res.status(400).json({
      status: "something error happened",
    });
    console.log(error);
  }
};

const recieverequest = async (req, res) => {
  const { Sender, Reciever, Amount } = req.body;

  try {
    const result = await pool
      .request()
      .input("sender", sql.Numeric, Sender)
      .input("reciever", sql.Numeric, Reciever)
      .input("amount", sql.Numeric, Amount)
      .query(
        `INSERT INTO REQUESTS (TYPE,SENDER,RECEIVER,AMOUNT) VALUES ('Send',@sender,@reciever,@amount)`
      );

    const data = result;

    res.status(201).json({
      data,
    });
  } catch (error) {
    res.status(400).json({
      status: "something error happened",
    });
    console.log(error);
  }
};

const adminusers = async (req, res) => {
  try {
    const result = await pool.request().query(
      `select NAME,AGE,BALANCE,EMAIL,STATUS,AID
        from ACCOUNT A
        INNER JOIN PERSON P ON A.PID = P.PID
        INNER JOIN CUSTOMER C ON C.PID = A.PID`
    );

    const data = result.recordsets;

    res.status(201).json({
      data,
    });
  } catch (error) {
    res.status(400).json({
      status: "something error happened",
    });
    console.log(error);
  }
};

const disableuser = async (req, res) => {
  const { AID } = req.body;
  try {
    const result = await pool
      .request()
      .input("aid", sql.Numeric, AID)
      .query(`Update ACCOUNT SET STATUS = 'disabled' where AID = @aid`);

    const data = result.recordsets;

    res.status(201).json({
      status: "done",
    });
  } catch (error) {
    res.status(400).json({
      status: "something error happened",
    });
    console.log(error);
  }
};

const enableuser = async (req, res) => {
  const { AID } = req.body;
  try {
    const result = await pool
      .request()
      .input("aid", sql.Numeric, AID)
      .query(`Update ACCOUNT SET STATUS = 'active' where AID = @aid`);

    const data = result.recordsets;

    res.status(201).json({
      status: "done",
    });
  } catch (error) {
    res.status(400).json({
      status: "something error happened",
    });
    console.log(error);
  }
};

const alltransactions = async (req, res) => {
  try {
    const result = await pool.request().query(`SELECT
      TRANSACTIONS.*,
      ACCOUNT.AID AS SenderAID,
	    RECEIVER_ACCOUNT.AID AS ReceiverAID,
      COALESCE(SENDER_PERSON.NAME, 'Unset') AS SenderName,
      COALESCE(RECEIVER_PERSON.NAME, 'Unset') AS ReceiverName
      FROM TRANSACTIONS
      INNER JOIN ACCOUNT ON ACCOUNT.AID = TRANSACTIONS.SENDER 
	    LEFT JOIN ACCOUNT AS RECEIVER_ACCOUNT ON RECEIVER_ACCOUNT.AID = TRANSACTIONS.RECIEVER
      LEFT JOIN PERSON SENDER_PERSON ON SENDER_PERSON.PID = ACCOUNT.PID
      LEFT JOIN PERSON RECEIVER_PERSON ON RECEIVER_PERSON.PID = RECEIVER_ACCOUNT.PID`);

    const data = result.recordsets;

    res.status(201).json({
      data,
    });
  } catch (error) {
    res.status(400).json({
      status: "something error happened",
    });
    console.log(error);
  }
};

const allemployees = async (req, res) => {
  try {
    const result = await pool.request()
      .query(`select NAME,ROLE,AGE,PHONENB,t1.PID
    from EMPLOYEE t1
    inner join PERSON t2 on t1.PID = t2.PID`);

    const data = result.recordsets;

    res.status(201).json({
      data,
    });
  } catch (error) {
    res.status(400).json({
      status: "something error happened",
    });
    console.log(error);
  }
};

const makeadmin = async (req, res) => {
  const { PID } = req.body;
  try {
    const result = await pool
      .request()
      .input("pid", sql.Numeric, PID)
      .query(`Update EMPLOYEE SET ROLE = 'Admin' where PID = @pid`);

    const data = result.recordsets;

    res.status(201).json({
      status: "done",
    });
  } catch (error) {
    res.status(400).json({
      status: "something error happened",
    });
    console.log(error);
  }
};
const makeemployee = async (req, res) => {
  const { PID } = req.body;
  try {
    const result = await pool
      .request()
      .input("pid", sql.Numeric, PID)
      .query(`Update EMPLOYEE SET ROLE = 'Employee' where PID = @pid`);

    const data = result.recordsets;

    res.status(201).json({
      status: "done",
    });
  } catch (error) {
    res.status(400).json({
      status: "something error happened",
    });
    console.log(error);
  }
};

module.exports = {
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
};
