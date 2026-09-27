import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Feedback.css";

export default function Feedback() {
  return <ToastContainer position="bottom-right" autoClose={5000} limit={3}
    theme="colored" role="status" closeOnClick={false}
    pauseOnFocusLoss pauseOnHover newestOnTop />;
}
