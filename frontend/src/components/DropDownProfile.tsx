import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/dropdown.scss";
import { signOut, selectUser } from "../redux/slices/authSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

const DropDownProfile = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user.isAuth) {
      navigate("/home");
    }
  }, [user, navigate]);

  const handleLogout = async (e: any) => {
    e.preventDefault();

    try {
      dispatch(signOut());
      // const response = await axios.post(`http://127.0.0.1:8000/logout/`);
      // console.log('Response:', response); // Log the entire response
      // console.log('Response status:', response.status); // Log specific properties

      // if (response.status === 200) {
      //   console.log(response.data?.message); // Log the email or undefined
      //   console.log('Logout');
      //   navigate('/');
      // } else {
      //   console.log("Err");
      // }
    } catch (err) {
      console.log("Error:", err); // Log any errors
    }
  };

  return (
    <div className="flex flex-col dropDownProfile">
      <ul className="items">
        <li className="item">Profile</li>
        <li className="item">Settings</li>
        <li className="item" onClick={handleLogout}>
          Logout
        </li>
      </ul>
    </div>
  );
};

export default DropDownProfile;
