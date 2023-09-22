import React, { useState } from 'react';
import '../styles/index.css';

function DeleteAcc() {
  const [showDeleteAcc, setShowDeleteAcc] = useState(false);

  const toggleDeleteAcc = () => {
    setShowDeleteAcc(!showDeleteAcc);
  };

  return (
    <div className={`delete-acc-container ${showDeleteAcc ? 'show-delete-acc' : ''}`}>
      <div className="delete-acc">
        <div className="delete-acc-header">
          <h2>Delete Account</h2>
          <button className="close-button" onClick={toggleDeleteAcc}>
            <span>&times;</span>
          </button>
        </div>
        <div className="delete-acc-content">
          <div className="delete-acc-icon">
            {/* You can replace this with your icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="104" height="103" viewBox="0 0 104 103" fill="none">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M28.2493 22.8732C29.0081 19.8026 30.9557 17.1593 33.6635 15.5246C36.3713 13.89 39.6175 13.3979 42.6881 14.1567C44.6282 14.6362 46.3978 15.5902 47.8501 16.9108L28.2818 28.7239C27.7898 26.8236 27.7699 24.8134 28.2493 22.8732ZM19.3307 34.1276C17.5618 29.808 17.1918 25.0088 18.3256 20.4209C19.7349 14.7183 23.3517 9.80919 28.3805 6.77341C33.4092 3.73763 39.438 2.82384 45.1405 4.23306C49.7285 5.36685 53.8032 7.92951 56.8012 11.5071L73.0709 1.68535C75.4874 0.226542 78.6291 1.00291 80.088 3.41947C81.5468 5.83609 80.7703 8.97777 78.3538 10.4366L72.5197 13.9586L101.576 62.0903C102.977 64.4111 103.399 67.1939 102.749 69.8258C102.099 72.4577 100.429 74.7235 98.1079 76.1245L57.2689 100.778C54.9479 102.18 52.1655 102.602 49.5337 101.951C46.9018 101.301 44.6358 99.6311 43.2347 97.3102L14.1782 49.1785L8.34409 52.7005C5.92751 54.1594 2.78587 53.383 1.32699 50.9664C-0.13186 48.5498 0.644514 45.4081 3.0611 43.9493L19.3307 34.1276ZM37.4091 48.1015C39.4229 46.8858 42.041 47.5329 43.2567 49.5466L57.3501 72.8922C58.5655 74.9056 57.9188 77.5241 55.905 78.7398C53.8911 79.9555 51.2728 79.3081 50.0574 77.2947L35.964 53.9491C34.7483 51.9354 35.3952 49.3173 37.4091 48.1015ZM66.5932 35.4587C65.3775 33.4449 62.7595 32.7978 60.7456 34.0136C58.7318 35.2293 58.0849 37.8474 59.3006 39.8612L73.394 63.2067C74.6094 65.2201 77.2277 65.8675 79.2415 64.6518C81.2554 63.4361 81.9021 60.8176 80.6866 58.8042L66.5932 35.4587Z" fill="white"/>
</svg>
          </div>
          <p></p>
        </div>
        <div className="delete-acc-footer">
          <button className="delete-acc-button" onClick={toggleDeleteAcc}>
            Cancel
          </button>
          <button className="delete-acc-button primary-button">
            Delete
          </button>
        </div>
      </div>
      <button className="open-button" onClick={toggleDeleteAcc}>
        Delete Account
      </button>
    </div>
  );
}

export default DeleteAcc;
