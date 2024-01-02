import React from "react";

function admintrans({ tran }) {
  // FOR DATEEEEE

  const timestampString = tran.DATE;
  const date = new Date(timestampString);

  // Get individual components of the date
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // Months are zero-based, so add 1
  const day = date.getDate();
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const meridiem = hours >= 12 ? "PM" : "AM";

  // Convert hours to 12-hour format
  hours = hours % 12 || 12;

  // Format the date as a string
  const formattedDate = `${year}-${month.toString().padStart(2, "0")}-${day
    .toString()
    .padStart(2, "0")} `;
  const dateq = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")} ${meridiem}`;

  // FOR DATEEEEE ENDEDDD
  return (
    <div className="admin-trans">
      <p>
        <span style={{ color: "blue" }}>Sender:</span>
        {tran.SenderName}
      </p>
      <p>
        <span style={{ color: "blue" }}>Reciever:</span> {tran.ReceiverName}
      </p>
      <p>
        <span style={{ color: "blue" }}>Amount:</span> {tran.AMOUNT}$
      </p>
      <p>
        <span style={{ color: "blue" }}>Date:</span>
        <span style={{ fontSize: "18px" }}>{formattedDate + dateq}</span>
      </p>
    </div>
  );
}

export default admintrans;
