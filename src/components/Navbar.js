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
              <div className="info-instructions">
                <p>Click <span> Play</span> and say <span>“New Category ... ”</span> to create a category.</p>
                <p>Click <span> Stop</span> to stop recording.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;