import React, { FormEvent, useState, useEffect } from "react";
import "../styles/class.scss";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { selectUser, signIn } from "../redux/slices/authSlice";

interface SigninModalProps {
  closeModal: () => void;
  userType: "student" | "teacher";
}

function SigninModal({ closeModal, userType }: SigninModalProps) {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (user.isAuth) {
      navigate("/classes");
      closeModal();
    }
  }, [user, navigate, closeModal]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(signIn({ username, password }));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div id="modal" className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h1 className="title">
            {userType === 'student' ? 'Signin Student' : 'Signin Teacher'}
          </h1>
          <span className="close title" onClick={closeModal}>
            &times;
          </span>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="User Name"
            name="username"
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="card-button">
            Signin
          </button>
        </form>
      </div>
    </div>
  );
}

export default SigninModal;
