import React, { useState } from 'react';
import Profile from '../routes/Profile';
import '../styles/PasswordReset.css';
import { Icon } from '../components/navbar';

const PasswordReset = () => {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const toggleShowPassword = (field) => {
    switch (field) {
      case 'oldPassword':
        setShowOldPassword(!showOldPassword);
        break;
      case 'newPassword':
        setShowNewPassword(!showNewPassword);
        break;
      case 'confirmPassword':
        setShowConfirmPassword(!showConfirmPassword);
        break;
      default:
        break;
    }
  };

  return (
    <>
      <Profile />
      <div className="parent-container">
        <h3>Reset Password</h3>
        <div className="field">
          <b>Old Password</b>
          <form action="">
            <input
              type={showOldPassword ? 'text' : 'password'}
              className="input-field"
            />
            <Icon
              path={showOldPassword ? 'eye-open' : 'eye-closed'}
              className="eye-icon"
              width="20"
              onClick={() => toggleShowPassword('oldPassword')}
            />
          </form>
        </div>

        <div className="field">
          <b>New Password</b>
          <form action="">
            <input
              type={showNewPassword ? 'text' : 'password'}
              className="input-field"
            />
            <Icon
              path={showNewPassword ? 'eye-open' : 'eye-closed'}
              className="eye-icon"
              width="20"
              onClick={() => toggleShowPassword('newPassword')}
            />
          </form>
        </div>

        <div className="field">
          <b>Confirm Password</b>
          <form action="">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              className="input-field"
            />
            <Icon
              path={showConfirmPassword ? 'eye-open' : 'eye-closed'}
              className="eye-icon"
              width="20"
              onClick={() => toggleShowPassword('confirmPassword')}
            />
          </form>
        </div>

        <div className='push'>
        <button className='btn'>save</button>
        </div>
      </div>
    </>
  );
};

export default PasswordReset;
