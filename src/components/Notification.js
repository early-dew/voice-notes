import React from 'react'

const Notification = ({ message, onCancel, onConfirm }) => {

  return (
    <div className="notification">
      <p>{message}</p>
      <div className="notification-buttons-container">
        <button onClick={onCancel} className="secondary-button">Cancel</button>
        <button onClick={onConfirm} className="primary-button">Confirm</button>
      </div>
    </div>
  );
};


export default Notification