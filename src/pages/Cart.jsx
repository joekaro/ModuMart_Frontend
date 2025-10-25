import { useCart } from "../context/cartContext";
import { Button, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const Cart = () => {
  const { cart, removeFromCart, clearCart } = useCart();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <>
        <div className="container text-center mt-5">
          <h4>Your cart is empty 🛍️</h4>
          <Link to="/products" className="btn btn-primary mt-3">
            Continue Shopping
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="container mt-4 mb-5">
        <h2 className="mb-4 text-center text-md-start">🛒 Your Cart</h2>

        {/* Responsive table wrapper */}
        <div className="table-responsive">
          <Table bordered hover className="align-middle text-center">
            <thead className="table-dark">
              <tr>
                <th>Product</th>
                <th>Price (₦)</th>
                <th>Qty</th>
                <th>Subtotal (₦)</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item._id}>
                  <td>
                    <div className="d-flex flex-column flex-md-row align-items-center text-center text-md-start">
                      <img
                        src={item.image}
                        alt={item.name}
                        width="70"
                        height="70"
                        className="rounded mb-2 mb-md-0 me-md-2"
                        style={{ objectFit: "cover" }}
                      />
                      <span className="fw-semibold">{item.name}</span>
                    </div>
                  </td>
                  <td>{item.price.toLocaleString()}</td>
                  <td>{item.quantity}</td>
                  <td>{(item.price * item.quantity).toLocaleString()}</td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => removeFromCart(item._id)}
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        {/* Summary section */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-4 gap-3">
          <h4 className="mb-0 text-center text-md-start">
            Total: ₦{total.toLocaleString()}
          </h4>
          <div className="d-flex flex-column flex-sm-row gap-2">
            <Button variant="secondary" onClick={clearCart}>
              Clear Cart
            </Button>
            <Link to="/checkout" className="btn btn-success">
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
