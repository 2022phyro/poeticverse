import React, { useState } from 'react';
import { Icon } from '../components/navbar';
import '../styles/Profile.css';
import { Link, useNavigate } from 'react-router-dom';
import FloatingProfile from '../components/FloatingProfile';

const Profile = () => {
  const [activeButton, setActiveButton] = useState(null);
  const [HandleDelete, setHandleDelete] = useState(false);

  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
  };

  const getButtonBackgroundColor = (buttonName) => {
    return activeButton === buttonName ? '#3A4B6B' : '';
  };

  const handleDelete = () => {
    setHandleDelete(!HandleDelete)
  }

  //add the functionality to delte a users account
  const location = useNavigate();

  const handleDeleteAccount = () => {
    //delete account logic
    location() //replace with the actual route
  }

  return (
    <>
    {HandleDelete && 
                    <div className="overlay">
                    <div className="delete-acc">
                    <div className="delete-acc-header">
                      <h2>Delete Account</h2>
                      <button className="close-button" onClick={handleDelete}>
                        <span>&times;</span>
                      </button>
                    </div>
                    <div className="delete-acc-content">
                      <div className="delete-acc-icon">
                       <Icon width='60' className='del' path= 'trash' />
                      </div>
                      <p>We're saddened to see you considering departure from our poetic community. Before you go, we'd like to offer you a choice, a path that suits your poetic journey best. Please select one of the following options</p>
                    </div>
                    <div className="delete-acc-footer">
                      <button className="delete-acc-button-1" onClick={handleDelete}>
                        Cancel
                      </button>&nbsp;&nbsp;
                      <button className="delete-acc-button-2">
                        Delete
                      </button>
                    </div>
                  </div>
                  </div>}
                  
      <div className="divider"></div>
      <div className="Profile-container">
        <div className="title">
          <h3>Profile</h3>
          <Icon className="create-icon" path="create" />
        </div>
        <div className="profile-sidebar">
          <div className="profile-content">
            <div className="profile-img">
              <Icon className="edit-icon" path="create" />
            </div>
            <div className="profile-body">
              <b>AFAM SOMETHING</b>&nbsp;&nbsp;
              <small className="verse">Verse Apprentice</small>
              <div className="list-group">
                <Link to="/feed/userinfo">
                  <div
                    className="list-item"
                    style={{ backgroundColor: getButtonBackgroundColor('userinfo') }}
                    onClick={() => handleButtonClick('userinfo')}
                  >
                    <Icon className="create-icon" path="user-info" />
                    <b>User Information</b>
                  </div>
                </Link>

                <Link to="/feed/resetpassword">
                  <div
                    className="list-item"
                    style={{ backgroundColor: getButtonBackgroundColor('resetpassword') }}
                    onClick={() => handleButtonClick('resetpassword')}
                  >
                    <Icon className="create-icon" path="lock" />
                    <b>Password Reset</b>
                  </div>
                </Link>

                <Link to = '/feed/changeEmail'>
                <div 
                className="list-item"
                    style={{ backgroundColor: getButtonBackgroundColor('changeEmail') }}
                    onClick={() => handleButtonClick('changeEmail')}>
                  <Icon className="create-icon" path="email" />
                  <b>Change Email</b>
                </div>
                </Link>

                <Link to= '/feed/verifyUser' >
                <div 
                className="list-item"
                style={{ backgroundColor: getButtonBackgroundColor('verifyUser') }}
                    onClick={() => handleButtonClick('verifyUser')}
                >
                  <Icon className="create-icon" width="20" path="verify" />
                  <b>Verify user</b>
                </div>
                </Link>

                <div 
                className="list-item" onClick={handleDelete}>
                  <Icon className="create-icon" path="trash" />
                  <b>Delete Account</b>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <FloatingProfile handleDeleteAccount={handleDeleteAccount} handleButtonClick = {handleButtonClick} getButtonBackgroundColor={getButtonBackgroundColor} handleDelete = {handleDelete} />
    </>
  );
};

export default Profile;
