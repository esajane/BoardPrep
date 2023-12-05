import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../styles/mocktestresults.scss';

const MockTestResults = () => {
  const [result, setResult] = useState({
   studentName: '',
   mocktestTitle: '',
   score: 0,
   totalScore: 0,
   dateOfMocktest: '',
  });
  const location = useLocation();
  const { state } = location;
  const { studentId, mocktestId } = useParams();
  const { score, total, mocktestName, studentName, dateOfMocktest } = location.state || {};

  useEffect(() => {
    console.log('Mocktest ID:', mocktestId);
    console.log('Student ID:', studentId);
    console.log('Score from state:', score);
    console.log('Total from state:', total);

    if (mocktestId && studentId) {
      axios.get(`http://127.0.0.1:8000/scores/?student_id=${studentId}`)
        .then((response) => {
          const resultData = response.data[0];
          console.log('Response Data:', resultData)
          setResult({
            studentName: resultData.student,
            mocktestTitle: resultData.mocktest_id,
            score: resultData.score,
            totalScore: resultData.totalQuestions,
            dateOfMocktest: resultData.mocktestDateTaken,
          });
        })
        .catch((error) => {
          console.error('There was an error fetching the mock test results', error);
        });
    }
  }, [mocktestId, studentId, score, total]);

  return (
    <div className="mocktest-results-container">
      <h1 className="mocktest-title">Mock Test for {result.mocktestTitle} Results</h1>
      <hr className="titleBar"></hr>
      <div className="mocktest-results">
        <div className="congratulations-box">
          <p className="congratulations-message">CONGRATULATIONS, {result.studentName}!</p>
        </div>
        <p className="score-message">
          for finishing the mock test for {result.mocktestTitle} with a score of <b>{score}/{total}</b> taken on <i>{result.dateOfMocktest}</i>.
        </p>
        <hr className="messageBar"></hr>
      </div>
      <div className="buttons-container">
          <button className="view-assessment-btn">VIEW ASSESSMENT</button>
          <button className="back-to-course-btn">BACK TO COURSE</button>
      </div>
    </div>
  );
};

export default MockTestResults;
