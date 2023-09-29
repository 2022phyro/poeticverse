import { useState, useEffect, useRef } from 'react';
import { Icon, Avatar } from '../components/navbar';
import '../styles/Profile.css';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import FloatingProfile from '../components/FloatingProfile';
import { api, usePopup } from '../utils';

function PictureUploader(props) {
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageUpload = () => {
    if (!selectedImage) {
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
    const file = e.target.files[0];
    setSelectedImage(file);
    console.log('file', file)
    handleImageUpload(); // Automatically upload the image when selected
  };

  return (
    <div className="profile-picture-uploader">
      <Avatar source={selectedImage || props.avatar} className='profile-img' />
      <Icon className="edit-icon" path="create" onClick={handleIconClick} />
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept="image/*"
        onChange={handleFileInputChange}
      />
    </div>
  );
}


const Profile = () => {
  const [activeButton, setActiveButton] = useState(null);
  const [pro, setPro] = useState({hellow: "yeos"});
  const openPopUp = usePopup()
  
  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
  };

  const getButtonBackgroundColor = (buttonName) => {
    return activeButton === buttonName ? '#3A4B6B' : '';
  };

  const handleDelete = () => {
    const message = `We're saddened to see you considering departure from our poetic community.
     Before you go, we'd like to offer you a choice, a path that suits your poetic journey best. Please select one of the following options`
    openPopUp(message, 'Delete', handleDeleteAccount)
  }

  //add the functionality to delte a users account
  const location = useNavigate();

  const handleDeleteAccount = () => {
    //delete account logic
    api(true).delete('/user')
    .then(() => {
      localStorage.clear()
      location('/') //replace with the actual route
    })
  }
  useEffect(() => {
    const user_id = JSON.parse(localStorage.getItem('myData'))['id'];
  
    api().get(`/user?user_id=${user_id}`)
      .then((res) => {
        const myData = res.data;
        console.log(myData)
        setPro(myData);
      });
  }, []);
  return (
    <>
          <div className="title">
            <h3>Settings</h3>
            <Icon className="create-icon" path="settings" />
          </div>
      <Outlet/>
      <>
        <div className="divider"></div>
        <div className="Profile-container">
          <div className="profile-sidebar">
            <div className="profile-content">
              <div className="">
                {/* <Avatar source={pro.profile_picture} className='profile-img'/>
                <Icon className="edit-icon" path="create" /> */}
                <PictureUploader avatar={pro.profile_picture}/>
              </div>
              <div className="profile-body">
                <b>{`${pro.first_name} ${pro.last_name}`}</b>&nbsp;&nbsp;
                <small className="verse">{pro.rank}</small>
                <div className="list-group">
                  <Link to={{pathname:"/feed/settings/userinfo", state:pro}}>
                    <div
                      className="list-item"
                      style={{ backgroundColor: getButtonBackgroundColor('userinfo') }}
                      onClick={() => handleButtonClick('userinfo')}
                    >
                      <Icon className="create-icon" path="user-info" />
                      <b>User Information</b>
                    </div>
                  </Link>

                  <Link to={{pathname:"/feed/settings/resetpassword", state: {pro}}}>
                    <div
                      className="list-item"
                      style={{ backgroundColor: getButtonBackgroundColor('resetpassword') }}
                      onClick={() => handleButtonClick('resetpassword')}
                    >
                      <Icon className="create-icon" path="lock" />
                      <b>Password Reset</b>
                    </div>
                  </Link>
                  <Link to= '/feed/settings/verifyUser' >
                  <div 
                  className="list-item"
                  style={{ backgroundColor: getButtonBackgroundColor('verifyUser') }}
                      onClick={() => handleButtonClick('verifyUser')}
                  >
                    <Icon className="create-icon" width="20" path="verify" />
                    <b>Verify user</b>
                  </div>
                  </Link>
                  <Link to = '/feed/settings/changeEmail'>
                  <div 
                  className="list-item"
                      style={{ backgroundColor: getButtonBackgroundColor('changeEmail') }}
                      onClick={() => handleButtonClick('changeEmail')}>
                    <Icon className="create-icon" path="email" />
                    <b>Change Email</b>
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
    </>
  );
};

export default Profile;
