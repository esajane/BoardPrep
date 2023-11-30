import { useState } from 'react';
import axios from 'axios';
import '../styles/class.scss';

interface SignupModalProps {
  closeModal: () => void;
  userType: 'student' | 'teacher';
}

function SignupModal({ closeModal, userType }: SignupModalProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [institutionid, setInstitutionid] = useState('');

  console.log(username);
  console.log(firstname);
  console.log(lastname);
  console.log(password);
  console.log(email);
  console.log(specialization);
  console.log(institutionid);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://127.0.0.1:8000/student/', {
        userName: username,
        password: password,
        firstName: firstname,
        lastName: lastname,
        email: email,
        specialization: specialization,
      });
      if (response.status === 201) {
        closeModal();
        console.log('Success Fully Registered');
      } else {
        console.log(response);
      }
    } catch (err) {
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
            type="text"
            placeholder="First Name"
            name="firstname"
            onChange={(e) => setFirstname(e.target.value)}
          />
          <input
            type="text"
            placeholder="Last Name"
            name="lastname"
            onChange={(e) => setLastname(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <select
            name="specialization"
            onChange={(e) => setSpecialization(e.target.value)}
          >
            <option value="">Select Specialization</option>
            <option value="1">Chemical Engineering</option>
            <option value="2">Civil Engineering</option>
            <option value="3">Electrical Engineering</option>
            <option value="4">Mechanical Engineering</option>
          </select>
          <button type="submit" className="card-button">
            Create
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignupModal;
