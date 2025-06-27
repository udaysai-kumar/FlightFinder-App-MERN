import React, { useState } from 'react';

const PaymentForm = ({ onPaymentSuccess }) => {
  const [upiId, setUpiId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!upiId.trim()) {
      alert('Enter a valid UPI ID');
      return;
    }

    setTimeout(() => {
      alert("✅ Payment Successful");
      onPaymentSuccess();
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '20px', textAlign: 'center' }}>
      <h4>Mock UPI Payment</h4>
      <input
        type="text"
        placeholder="Enter UPI ID"
        value={upiId}
        onChange={(e) => setUpiId(e.target.value)}
        style={{ padding: '10px', width: '60%' }}
      />
      <br /><br />
      <button type="submit" className="btn btn-success">Pay Now</button>
    </form>
  );
};

export default PaymentForm;
