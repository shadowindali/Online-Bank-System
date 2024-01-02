import axios from "axios";
import Swal from "sweetalert2";
import "./Send.css";

function req({ req }) {
  const config = {
    headers: {
      "Content-type": "application/json",
    },
  };

  const reqs = {
    Sender: localStorage.getItem("AID"),
    Reciever: req.SENDER,
    Amount: String(req.AMOUNT),
  };

  const maketransreq = async () => {
    Swal.fire({
      title: "Do you want to transfer money?",
      showCancelButton: true,
      confirmButtonText: "Save",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .post(
            `${import.meta.env.VITE_API_URL}/user/sendrequest/`,
            reqs,
            config
          )
          .then(async ({ data }) => {
            if (data.message === "Insufficient funds in the source account.") {
              Swal.fire({
                icon: "error",
                text: "Insufficient funds in the source account.",
              });
            }
            if (data.message === "Money transferred successfully.") {
              deletereq();
              await Swal.fire("Money transferred successfully.", "", "success");
              location.reload();
            }
          });
      }
    });
  };

  const deletereq = async () => {
    axios
      .delete(
        `${import.meta.env.VITE_API_URL}/user/deletereq/${req.RID}`,
        config
      )
      .then((data) => {
        console.log(data);
      });
  };

  const denybutton = () => {
    Swal.fire({
      title: "Do you want to deny request?",
      showCancelButton: true,
      confirmButtonText: "Save",
    }).then((result) => {
      if (result.isConfirmed) {
        deletereq().then(() => {
          Swal.fire("DELETED.", "", "success");
          location.reload();
        });
      }
    });
  };

  return (
    <div className="req-cont">
      <div className="req-cont-up">
        <p>{req.SENDER_NAME}</p>
        <p> {req.AMOUNT} $</p>
      </div>
      <div className="req-cont-down">
        <button onClick={maketransreq} style={{ background: "green" }}>
          Accept
        </button>
        <button onClick={denybutton} style={{ background: "red" }}>
          Deny
        </button>
      </div>
    </div>
  );
}

export default req;
