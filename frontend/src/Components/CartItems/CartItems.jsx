import React, { useContext } from "react";
import "./CartItems.css";
import { ShopContext } from "../../Context/ShopContext";
import remove_icon from "../Assets/cart_cross_icon.png";
const API_URL=process.env.REACT_APP_API_URL;
// const
// console.log("API URL: in cart", API_URL);

const CartItems = () => {
  const {getTotalCartAmount, all_product, cartItems, removeFromCart } = useContext(ShopContext);

  const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};
  const handlepayment=async()=>{
   const res = await loadRazorpayScript();
  if (!res) {
    alert("Razorpay SDK failed to load. Check your network.");
    return;
  }

  // Fetch order from backend
  const orderResponse = await fetch(`${API_URL}/create-order`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount: 500 }),
  });

  const data = await orderResponse.json();
 
    const options = {
      key: `${process.env.REACT_APP_R_KEY_ID}`, 
      amount: data.amount,
      currency: data.currency,
      name: "Store Name",
      description: "Thanks for shopping with us!",
      order_id: data.id, // This comes from backend
      handler: function (response) {
        alert("Payment Successful! Payment ID: " + response.razorpay_payment_id);
      },
      prefill: {
        name: "John Doe",
        email: "johndoe@example.com",
        contact: "9876543210",
      },
      theme: {
        color: "#3399cc",
      },
    };

    // 3️⃣ Create Razorpay instance and open popup
    const rzp = new window.Razorpay(options);
    rzp.open();
  };
  return (
    <div className="cartitems">
      <div className="cartitems-format-main">
        <p>Product</p>
        <p>Title</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Remove</p>
      </div>
      <hr />
      {all_product.map((e) => {
        if (cartItems[e.id] > 0) {
          return <div>
              <div className="cartitems-format cartitems-format-main">
                <img src={e.image} alt="" className="carticon-product-icon" />
                <p>{e.name}</p>
                <p>${e.new_price}</p>
                <button className="cartitems-quantity">
                  {cartItems[e.id]}
                </button>
                <p>${e.new_price * cartItems[e.id]}</p>
                <img
                  className="cartitems-remove-icon"
                  src={remove_icon}
                  onClick={() => {
                    removeFromCart(e.id);
                  }}
                  alt=""
                />
              </div>
              <hr />
            </div>
          
        } 
        return null;
      })}
      <div className="cartitems-down">
        <div className="cartitems-total">
            <h1>Cart Totals</h1>
            <div>
                <div className="cartitems-total-item">
                    <p>Subtotal</p>
                    <p>${getTotalCartAmount()}</p>
                </div>
                <hr/>
                <div className="cartitems-total-item">
                    <p>Shipping Fee</p>
                    <p>Free</p>
                </div>
                <hr/>
                <div className="cartitems-total-item">
                    <h3>Total</h3>
                    <h3>${getTotalCartAmount()}</h3>
                </div>
            </div>
            <button onClick={handlepayment}>PROCEED TO CHECKOUT</button>
        </div>
        <div className="cartitem-promocode">
            <p>Enter promo code </p>
        
        <div className="cartitems-promobox">
            <input type="text" placeholder="promo code" />
            <button>Submit</button>
        </div>
        </div>
      </div>
    </div>
  );
};

export default CartItems;
