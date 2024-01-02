import React, { useEffect, useState } from "react";
import "./Profile.css";
import PersonIcon from "@mui/icons-material/Person";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SendIcon from "@mui/icons-material/Send";
import CallReceivedIcon from "@mui/icons-material/CallReceived";

function TransCard(props) {
  const [sent, setSent] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    if (props.name === props.tran.SenderName) {
      setSent(true);
      setName(props.tran.ReceiverName);
    } else {
      setName(props.tran.SenderName);
    }
  }, []);

  // FOR DATEEEEE

  const timestampString = props.tran.DATE;
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
    <div className="transaction-card-container">
      {sent ? (
        <p style={{ color: "red" }}>
          <SendIcon /> Sent
        </p>
      ) : (
        <p style={{ color: "green" }}>
          <CallReceivedIcon /> Received
        </p>
      )}

      <p>
        <PersonIcon /> {name}
      </p>

      <p>
        <CurrencyExchangeIcon /> {props.tran.AMOUNT} $
      </p>

      <div>
        <p style={{ fontSize: "1.1em" }}>
          <CalendarMonthIcon /> {formattedDate}
        </p>
        <p style={{ fontSize: "0.8em" }}>{dateq}</p>
      </div>
    </div>
  );
}

export default TransCard;
