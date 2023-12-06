import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/mocktestresults.scss';

const MockTestResults = () => {
  const [result, setResult] = useState({
   studentName: '',
   mocktestName: '',
   score: 0,
   totalScore: 0,
   dateOfMocktest: '',
  });
  const location = useLocation();
  const { state } = location;
  const { course_id, mocktest_id, classId } = useParams();
  const navigate = useNavigate();
  const { score, total, mocktestName, studentName, dateOfMocktest } = state;

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const handleBackToClass = () => {
    navigate(`/classes/`);
  };

  useEffect(() => {
    console.log('Mocktest Name:', mocktestName);
    console.log('Student ID:', 'niggasecoya');
    console.log('Score from state:', score);
    console.log('Total from state:', total);

    if (mocktest_id && 'niggasecoya') {
      axios.get(`http://127.0.0.1:8000/scores/?student_id=${'niggasecoya'}&mocktest_id=${mocktest_id}`)
        .then((response) => {
          const resultData = response.data.length ? response.data[0] : null;
          console.log('Response Data:', resultData)
          if(resultData) {
              setResult({
                studentName: resultData.student,
                mocktestName: resultData.mocktestName,
                score: resultData.score,
                totalScore: resultData.totalQuestions,
                dateOfMocktest: formatDate(resultData.mocktestDateTaken),
              });
          } else {
             console.error('Score data is not available for this mock test.');
          }
        })
        .catch((error) => {
          console.error('There was an error fetching the mock  test results', error);
        });
    }
  }, [mocktestName, 'niggasecoya', score, total]);
  console.log(result);

  return (
    <div className="mocktest-results-container">
      <h1 className="mocktest-title"><b>{result.mocktestName}</b> Results</h1>
      <hr className="titleBar"></hr>
      <div className="mocktest-results">
        <div className="congratulations-box">
          <p className="congratulations-message">CONGRATULATIONS, <b>{result.studentName}!</b></p>
        </div>
        <p className="score-message">
          for finishing the mock test for <b>{result.mocktestName}</b> with a score of <b>{score}/{total}</b> taken on <i>{result.dateOfMocktest}</i>.
        </p>
        <hr className="messageBar"></hr>
      </div>
      <div className="buttons-container">
          <button className="view-assessment-btn">VIEW ASSESSMENT</button>
          <button className="back-to-class-btn" onClick={handleBackToClass}>BACK TO CLASS</button>
      </div>
    </div>
  );
};

export default MockTestResults;
