import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/mocktestresults.scss';
import { useAppSelector } from "../redux/hooks";
import { selectUser } from "../redux/slices/authSlice";
import PerformanceAssessment from '../components/PerformanceAssessment';

type ScoreDetailsType = {
  easy_count: number;
  medium_count: number;
  hard_count: number;
  subjects_count: number;
};

const MockTestResults = () => {
  const user = useAppSelector(selectUser);
  const [result, setResult] = useState({
   studentName: '',
   mocktestName: '',
   score: 0,
   totalScore: 0,
   dateOfMocktest: '',
   easyCount: 0,
   mediumCount: 0,
   hardCount: 0,
   subjectsCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showAssessment, setShowAssessment] = useState(false);
  const location = useLocation();
  const { state } = location;
  const { course_id, mocktest_id, id } = useParams();
  const navigate = useNavigate();
  const { score, total, mocktestName, studentName, dateOfMocktest } = state || {};
  const isPremium = true;
  const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const handleBackToClass = () => {
    const path = window.location.pathname;
    console.log(path.split("/")[2]);
    const classID = path.split("/")[2];
    navigate(`/classes/${classID}`);
  };

  const viewAssessmentHandler = () => {
    setShowAssessment(true);
  };

//   const getUserDetails = () => {
//     axios.get(`http://127.0.0.1:8080/students`)

  useEffect(() => {
    console.log('Mocktest Name:', mocktestName);
    console.log('Student ID:', user.token.id);
    console.log('Score from state:', score);
    console.log('Total from state:', total);

    if (mocktest_id && user.token.id) {
      axios.get(`http://127.0.0.1:8000/scores/?student_id=${user.token.id}&mocktest_id=${mocktest_id}`)
        .then((response) => {
          const resultData = response.data.length ? response.data[0] : null;
          console.log('Response Data:', resultData)
          if(resultData) {
              const updatedResult = {
                studentName: resultData.studentName,
                mocktestName: resultData.mocktestName,
                score: resultData.score,
                totalScore: resultData.totalQuestions,
                dateOfMocktest: formatDate(resultData.mocktestDateTaken),
                easyCount: resultData.easy_count,
                mediumCount: resultData.medium_count,
                hardCount: resultData.hard_count,
                subjectsCount: resultData.subjects_count
              };
              setResult(updatedResult);
              console.log('Updated Result State:', updatedResult);
          } else {
             console.error('Score data is not available for this mock test.');
          }
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('There was an error fetching the mock  test results', error);
          setIsLoading(false);
        });
    }
  }, [mocktest_id, user.token.id]);

  if(isLoading) {
    return <div>Loading mock test results...</div>;
  }

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
          { isPremium &&
                <button className="view-assessment-btn" onClick={viewAssessmentHandler}>VIEW ASSESSMENT</button>
          }
          <button className="back-to-class-btn" onClick={handleBackToClass}>BACK TO CLASS</button>
      </div>
      {showAssessment && (
        <PerformanceAssessment
          score={score}
          totalScore={total}
          easyPercentage={(result.easyCount / total) * 100}
          mediumPercentage={(result.mediumCount / total) * 100}
          hardPercentage={(result.hardCount / total) * 100}
          subjectsCount={result.subjectsCount}
          onClose={() => setShowAssessment(false)}
        />
      )}
    </div>
  );
};

export default MockTestResults;
