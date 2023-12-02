import React, { FormEvent, useState } from 'react';
import axios from 'axios';
import '../styles/class.scss';

interface SigninModalProps {
  closeModal: () => void;
  userType: 'student' | 'teacher';
}

function SigninModal({ closeModal, userType  }: SigninModalProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  console.log(username);
  console.log(password);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://127.0.0.1:8000/login/${userType}/`, {
        username,
        password
      })
      console.log(response.data);
      closeModal();
    } catch(err) {
      console.log(err);
    }
  };

  return (
    <div id="modal" className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h1 className="title">{userType === 'student' ? 'Signup Student' : 'Signup Teacher'}</h1>
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


