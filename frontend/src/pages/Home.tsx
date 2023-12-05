import '../styles/home.scss';
import boardprep from '../assets/boardprep.png';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const studentHandler = () => {
    navigate("/student");
  }

  const teacherHandler = () => {
    navigate("/teacher")
  }

  return (
    <div className="background">
      <header>
        <h1><a href='/' className='homer'>BoardPrep</a></h1>
        <div className="user">
          <button className='user-c' onClick={studentHandler}>Student</button>
          <button className='user-c'onClick={teacherHandler}>Teacher</button>
        </div>
      </header>
      <div className="content">
        <div className="ct">
          <h3 className="ct-title">
            Embrace Success with BoardPrep: Tailored for Triumph
          </h3>
          <p className="ct-p">
            Lorem ipsum dolor sit amet consectetur <br /> adipisicing elit. Aut
            saepe voluptatum earum delectus <br /> deserunt id iste, quas
            officiis et repellat!
          </p>
        </div>
        <div className='ani'>
          <img src={boardprep} alt="boardprep" className="bp-img" />
          <div className="cardo dalisay"></div>
        </div>
      </div>
    </div>
  );
}

export default Home;
