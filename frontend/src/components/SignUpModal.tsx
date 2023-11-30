import { useState } from 'react';
import '../styles/class.scss';

interface SignupModalProps {
  closeModal: () => void;
  userType: 'student' | 'teacher';
}

function SignupModal({ closeModal }: SignupModalProps) {
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

  const handleSubmit = (e: any) => {
    e.preventDefault();
  };

  return (
    <div id="modal" className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h1 className="title">SignUp Student</h1>
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
          <input
            type="text"
            placeholder="Specialization"
            name="specialization"
            onChange={(e) => setSpecialization(e.target.value)}
          />
          <input
            type="text"
            placeholder="Institution ID"
            name="institutionid"
            onChange={(e) => setInstitutionid(e.target.value)}
          />
          <button type="submit" className="card-button">
            Create
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignupModal;
