import React, { useState } from 'react'
import '../styles/floatingProfile.css'
import { api } from '../utils';
import { useRef } from 'react'
import { Avatar, Icon } from './navbar'
import { Link } from 'react-router-dom'

const FloatingProfile = ({ handleDelete }) => {

    const [floater, setFloater] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const fileInputRef = useRef(null);
  
    const handleImageUpload = () => {
      if (!selectedImage) {
        console.log('Debugging')
        return;
      }
  
      const formData = new FormData();
      formData.append('profile_picture', selectedImage);
  
      console.log('FormData:', formData);
      // Use try-catch to handle errors
      try {
        api(true)
          .post(`/profile_picture`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            }
          }).then(() => {
            console.log('Profile picture uploaded successfully');
          })
          .catch((err) => {
            console.error('Error uploading profile picture:', err);
          });
      } catch (error) {
        console.error('Error:', error);
      }
    };
  
    const handleIconClick = () => {
      fileInputRef.current.click();
    };
  
    const handleFileInputChange = (e) => {
        console.log("Changed")
      const file = e.target.files[0];
      setSelectedImage(file);
      console.log('file', file)
      handleImageUpload(); // Automatically upload the image when selected
    };

    const handleFloater = () => {
        setFloater(!floater)
    }
  return (
    <>
    {floater && <div className='floater-content' onClick={handleFloater}>
        <div className="list">
        <Icon className="inf" path="create" onClick={handleIconClick} />
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept="image/*"
        onChange={handleFileInputChange}
      />
      <p>Change Avatar</p>

        </div>
        <Link to = '/feed/settings/userinfo'>
        <div className="list">
            <Icon path = 'user-info' className='inf'/>
            <p>Edit your Profile</p>
        </div>
        </Link>
        <Link to = '/feed/settings/resetpassword'>
        <div className="list">
            <Icon path = 'lock' width = '24'/>
            <p>Change Password</p>
        </div>
        </Link>
        <Link to = '/feed/settings/verifyUser'>
        <div className="list">
            <Icon path = 'verify' className='inf'/>
            <p>Verify Account</p>
        </div>
        </Link>
        <Link to = '/feed/settings/changeEmail'>
        <div className="list">
            <Icon path = 'email' className='inf'/>
            <p>Change Email</p>
        </div>
        </Link>

        <div className="list" onClick={handleDelete}>
            <Icon path = 'trash' className='inf'/>
            <p>Delete Account</p>
        </div>
        </div>}

    <div className="floatingProfile" onClick={handleFloater}>
        <div className="floater">
        <Icon path= 'bookmark' />
        </div>
    </div>
    </>
  )
}

export default FloatingProfile
