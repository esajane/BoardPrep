import React from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import '../styles/dropdown.scss';

const DropDownProfile = () => {
  const navigate = useNavigate();


  const handleLogout = async (e: any) => {
    e.preventDefault();

    try {
      const response = await axios.post(`http://127.0.0.1:8000/logout/`);
      console.log('Response:', response); // Log the entire response
      console.log('Response status:', response.status); // Log specific properties


      if (response.status === 200) {
        console.log(response.data?.message); // Log the email or undefined
        console.log('Logout');
        navigate('/');
      } else {
        console.log("Err");
      }
    } catch (err) {
      console.log('Error:', err); // Log any errors
    }
  };

  return (
    <div className="flex flex-col dropDownProfile">
      <ul className="items">
        <li>Profile</li>
        <li>Settings</li>
        <li onClick={handleLogout}>Logout</li>
      </ul>
    </div>
  );
};

export default DropDownProfile;
