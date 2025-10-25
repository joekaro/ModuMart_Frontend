import { Toast, ToastContainer } from "react-bootstrap";

const ToastMessage = ({ show, onClose, message, variant = "success" }) => {
  return (
    <ToastContainer position="top-end" className="p-3">
      <Toast onClose={onClose} show={show} bg={variant} delay={3000} autohide>
        <Toast.Header>
          <strong className="me-auto">ModuMart</strong>
        </Toast.Header>
        <Toast.Body className="text-white">{message}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default ToastMessage;
