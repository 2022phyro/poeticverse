import React, { useState } from 'react';
import '../styles/index.css';

function DeleteAcc() {
  const [showDeleteAcc, setShowDeleteAcc] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const toggleDeleteAcc = () => {
    setShowDeleteAcc(!showDeleteAcc);
  };

  const toggleConfirmation = () => {
    setShowConfirmation(!showConfirmation);
  };

  const confirmDelete = () => {
    // Handle the delete operation here
    // You can perform the actual deletion and then close both pop-ups
    // For demonstration, we will just close the pop-ups here
    setShowDeleteAcc(false);
    setShowConfirmation(false);
  };

  const cancelDelete = () => {
    // Close both pop-ups when the "Cancel" button is clicked
    setShowDeleteAcc(false);
    setShowConfirmation(false);
  };

  return (
    <div className="delete-acc-container">
      <div className={`delete-acc ${showDeleteAcc ? 'show-delete-acc' : ''}`}>
        <div className="delete-acc-header">
          <h2>Delete Account</h2>
          <button className="close-button" onClick={toggleDeleteAcc}>
            <span>&times;</span>
          </button>
        </div>
        <div className="delete-acc-content">
          <div className="delete-acc-icon">
            {/* You can replace this with your icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="129" height="130" viewBox="0 0 129 130" fill="none">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M39.2493 39.8732C40.0081 36.8026 41.9557 34.1593 44.6635 32.5246C47.3713 30.89 50.6175 30.3979 53.6881 31.1567C55.6282 31.6362 57.3978 32.5902 58.8501 33.9108L39.2818 45.7239C38.7898 43.8236 38.7699 41.8134 39.2493 39.8732ZM30.3307 51.1276C28.5618 46.808 28.1918 42.0088 29.3256 37.4209C30.7349 31.7183 34.3517 26.8092 39.3805 23.7734C44.4092 20.7376 50.438 19.8238 56.1405 21.2331C60.7285 22.3668 64.8032 24.9295 67.8012 28.5071L84.0709 18.6854C86.4874 17.2265 89.6291 18.0029 91.088 20.4195C92.5468 22.8361 91.7703 25.9778 89.3538 27.4366L83.5197 30.9586L112.576 79.0903C113.977 81.4111 114.399 84.1939 113.749 86.8258C113.099 89.4577 111.429 91.7235 109.108 93.1245L68.2689 117.778C65.9479 119.18 63.1655 119.602 60.5337 118.951C57.9018 118.301 55.6358 116.631 54.2347 114.31L25.1782 66.1785L19.3441 69.7005C16.9275 71.1594 13.7859 70.383 12.327 67.9664C10.8681 65.5498 11.6445 62.4081 14.0611 60.9493L30.3307 51.1276ZM48.4091 65.1015C50.4229 63.8858 53.041 64.5329 54.2567 66.5466L68.3501 89.8922C69.5655 91.9056 68.9188 94.5241 66.905 95.7398C64.8911 96.9555 62.2728 96.3081 61.0574 94.2947L46.964 70.9491C45.7483 68.9354 46.3952 66.3173 48.4091 65.1015ZM77.5932 52.4587C76.3775 50.4449 73.7595 49.7978 71.7456 51.0136C69.7318 52.2293 69.0849 54.8474 70.3006 56.8612L84.394 80.2067C85.6094 82.2201 88.2277 82.8675 90.2415 81.6518C92.2554 80.4361 92.9021 77.8176 91.6866 75.8042L77.5932 52.4587Z" fill="white"/>
</svg>
          </div>
          <p>We're saddened to see you considering departure from our poetic community. Before you go, we'd like to offer you a choice, a path that suits your poetic journey best. Please select one of the following options</p>
          <button className="delete-acc-button" onClick={toggleConfirmation}>
            Delete Account
          </button>
        </div>
        <div className="delete-acc-footer">
          <button className="delete-acc-button cancel-button" onClick={cancelDelete}>
            Cancel
          </button>
        </div>
      </div>

      {/* Confirmation Pop-up */}
      {showConfirmation && (
        <div className="confirmation-popup">
          <div className="confirmation-header">
            <h2>Are you sure?</h2>
            <button className="close-button" onClick={toggleConfirmation}>
              <span>&times;</span>
            </button>
          </div>
          <div className="confirmation-content">
          <div className="confirmation-icon">
            {/* You can replace this with your icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="114" height="114" viewBox="0 0 114 114" fill="none">
  <g clip-path="url(#clip0_437_1004)">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M99.7383 42.9128C107.518 66.5165 94.6908 91.958 71.0871 99.738C47.4835 107.518 22.0419 94.6906 14.2618 71.0868C6.48179 47.4832 19.3094 22.0416 42.913 14.2616C66.5167 6.48152 91.9582 19.3091 99.7383 42.9128ZM45.8465 48.8308C44.4572 44.6158 46.7478 40.0727 50.9628 38.6834C55.1777 37.2941 59.7208 39.5847 61.1101 43.7997C62.4994 48.0147 60.2088 52.5578 55.9938 53.9471C53.4649 54.7806 52.0905 57.5066 52.9241 60.0355L54.2251 63.9826C55.0587 66.5116 57.7846 67.8859 60.3135 67.0523C62.8424 66.2188 64.2169 63.4929 63.3833 60.9639C69.7735 56.6479 72.8015 48.4665 70.2683 40.7811C67.2119 31.5082 57.217 26.4688 47.9441 29.5252C38.6713 32.5817 33.6318 42.5766 36.6883 51.8494C37.5219 54.3784 40.2478 55.7528 42.7767 54.9192C45.3056 54.0856 46.68 51.3597 45.8465 48.8308ZM70.149 76.3565C71.2605 79.7285 69.428 83.3629 66.056 84.4744C62.684 85.5858 59.0496 83.7534 57.9381 80.3814C56.8267 77.0094 58.6592 73.3749 62.0311 72.2635C65.4031 71.152 69.0376 72.9845 70.149 76.3565Z" fill="white"/>
  </g>
  <defs>
    <clipPath id="clip0_437_1004">
      <rect width="90" height="90" fill="white" transform="translate(0.174805 28.3486) rotate(-18.2429)"/>
    </clipPath>
  </defs>
</svg>
          </div>
            <p>Are you sure you want to delete your account?</p>
          </div>
          <div className="confirmation-footer">
            <button className="confirmation-button delete-button" onClick={confirmDelete}>
              Delete
            </button>
            <button className="confirmation-button cancel-button" onClick={cancelDelete}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DeleteAcc;
