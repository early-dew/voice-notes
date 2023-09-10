import React, { useState } from 'react';

const Navbar = () => {

  const [popupVisible, setPopupVisible] = useState(false);

  const handleInfoClick = () => {
    setPopupVisible(!popupVisible)
  };

  const handleClosePopup = () => {
    setPopupVisible(false);
  };

  return (
    <>
      <div className="navbar">
        <div className="logo">
          <img src="logo_voice_notes.svg" alt="Logo" />
        </div>
        <div className="info-container">
          <button className="info-button" onClick={handleInfoClick}>
            <img src="ion_information-circle-sharp.svg" alt="info" />
          </button>
        </div>
        {popupVisible && (
          <div className="info-popup">
            <button>
              <img src="close-window.svg" alt="close" onClick={handleClosePopup} />
            </button>
            <div className="info-text">
              <p>How to use</p>
              <p>Click Play and say New Category “Name” to create a category</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;