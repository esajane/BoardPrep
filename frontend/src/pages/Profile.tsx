import { useState, useEffect } from 'react';
import { useAppSelector } from '../redux/hooks';
import { selectUser } from '../redux/slices/authSlice';
import '../styles/profile.scss';
import axios from 'axios';

const Profile = () => {
  const user = useAppSelector(selectUser);
  const [activeButton, setActiveButton] = useState('personal');
  const [details, setDetails] = useState<any>({});
  const [editedDetails, setEditedDetails] = useState<any>({});
  const [isSaveActive, setIsSaveActive] = useState(false);

  useEffect(() => {
    getDetails();
  }, []);

  const handleButtonClick = (buttonType: any) => {
    setActiveButton(buttonType);
  };

  const getDetails = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/get/user/', {
        params: {
          username: user.token.id,
        },
      });
      setDetails(res.data);
      setEditedDetails(res.data);
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setEditedDetails({ ...editedDetails, [name]: value });

    const isValueChanged = value !== details[name];

    setIsSaveActive(isValueChanged);
  };

  const handleSaveButton = async () => {
    try {
      const res = await axios.put(
        `http://127.0.0.1:8000/update/user/?username=${user.token.id}`,
        editedDetails
      );
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
    console.log(editedDetails);
  };

  return (
    <div className="profile">
      <div className="account-details">
        <div>
          <h3>Account Details</h3>
          <div className="account-details-choice">
            <button
              className={activeButton === 'personal' ? 'active' : ''}
              onClick={() => handleButtonClick('personal')}
            >
              Personal Information
            </button>
            <button
              className={activeButton === 'account' ? 'active' : ''}
              onClick={() => handleButtonClick('account')}
            >
              Account Information
            </button>
          </div>
        </div>
      </div>
      <div className="account-details-content">
        {activeButton === 'personal' && (
          <div className="personal-information">
            <h2>Personal Information</h2>
            <div className="input-container">
              <label className="input-label">First Name</label>
              <input
                className="details"
                type="text"
                name="first_name"
                value={editedDetails.first_name || ''}
                onChange={handleInputChange}
              />
            </div>
            <div className="input-container">
              <label className="input-label">Last Name</label>
              <input
                className="details"
                type="text"
                name="last_name"
                value={editedDetails.last_name || ''}
                onChange={handleInputChange}
              />
            </div>
            <div className="input-container">
              <label className="input-label">Email</label>
              <input
                className="details"
                type="email"
                name="email"
                value={editedDetails.email || ''}
                onChange={handleInputChange}
              />
            </div>
            {/* <button
            className="save-button"
            onClick={handleSaveButton}
            disabled={!isSaveActive}
          >
            Save
          </button> */}
          </div>
        )}

        {activeButton === 'account' && (
          <div className="account-information">
            <h2>Account Information</h2>

            <div className="subscription">
              <h3>Subscription</h3>
              <div className='sub-details'>
                {details.subscription ? <h1>Premium</h1> : <h1>Free</h1>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
