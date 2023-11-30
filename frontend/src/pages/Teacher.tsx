import { useState } from 'react';
import SignupModal from '../components/SignUpModal';
import SigninModal from '../components/SignInModal';
import '../styles/home.scss';

const Teacher = () => {
  const [modalOpenSignin, setModalOpenSignin] = useState(false);
  const [modalOpenSignup, setModalOpenSignup] = useState(false);

  const openModalSignin = () => {
    setModalOpenSignin(true);
    console.log('Open Signin');
  };

  const closeModalSignin = () => {
    setModalOpenSignin(false);
    console.log('Close Signin');
  };

  const openModalSignup = () => {
    // Logic for opening Signup modal
    setModalOpenSignup(true);
    console.log('Open Signup');
  };

  const closeModalSignup = () => {
    // Logic for opening Signup modal
    setModalOpenSignup(false);
    console.log('Close Signup');
  };

  return (
    <div className="background">
      <header>
        <h1>BoardPrep - Teacher</h1>
        <div>
          <button className="button" onClick={openModalSignin}>
            Signin
          </button>
          <button className="button" onClick={openModalSignup}>
            Signup
          </button>
          {modalOpenSignup && (
            <SignupModal closeModal={closeModalSignup} userType="teacher" />
          )}
          {modalOpenSignin && <SigninModal closeModal={closeModalSignin} />}
        </div>
      </header>
    </div>
  );
};

export default Teacher;
