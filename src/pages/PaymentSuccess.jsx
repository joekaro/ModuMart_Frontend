import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import api from "../api/axios";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get("reference");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("Verifying payment...");

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const { data } = await api.post("/orders/verify", { reference });
        toast.success("Payment verified successfully!");
        setMessage("Payment verified successfully ✅");
      } catch (error) {
        console.error("Verification error:", error.response?.data || error.message);
        toast.error("Payment verification failed!");
        setMessage("Payment verification failed ❌");
      } finally {
        setLoading(false);
      }
    };

    if (reference) verifyPayment();
    else {
      setMessage("Missing payment reference!");
      setLoading(false);
    }
  }, [reference]);

  return (
    <div className="container text-center mt-5">
      {loading ? (
        <>
          <Spinner animation="border" variant="success" />
          <p>{message}</p>
        </>
      ) : (
        <h4>{message}</h4>
      )}
      <p className="mt-3">
        <a href="/" className="btn btn-success">
          Back to Shop
        </a>
      </p>
    </div>
  );
};

export default PaymentSuccess;
