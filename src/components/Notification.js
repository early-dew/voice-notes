const Notification = ({ message, onCancel, onConfirm }) => {

  return (
    <div className="notification">
      <p>{message}</p>
      <button onClick={onCancel}>Cancel</button>
      <button onClick={onConfirm}>Confirm</button>
    </div>
  );
};


export default Notification