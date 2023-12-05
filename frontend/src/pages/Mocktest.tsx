import React, { useEffect, useState, useRef} from 'react';
import axios from 'axios';
import MockTestCard from '../components/Mocktestcard';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/mocktest.scss';

interface MocktestDetail {
  mocktestID: number;
  mocktestName: string;
  mocktestDescription: string;
}

interface Question {
  id: number;
  question: string;
  choiceA: string;
  choiceB: string;
  choiceC: string;
  choiceD: string;
  subject: string;
}

const Mocktest: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [mocktestDetail, setMocktestDetails] = useState<MocktestDetail | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(3600);
  const [answers, setAnswers] = useState({});
  const intervalId = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  const { course_id, mocktest_id } = useParams<{ course_id: string; mocktest_id: string; }>();

  useEffect(() => {
    if(course_id) {
        axios.get(`http://127.0.0.1:8000/mocktest/?course_id=${course_id}`)
        .then(response => {
          console.log(response.data[0])
          setMocktestDetails(response.data[0]);
          setQuestions(response.data[0].question);
        })
        .catch(error => {
          console.error('There was an error fetching the mock test details', error);
        });
    }
  }, [course_id]);


  useEffect(() => {
    intervalId.current = setInterval(() => {
      setTimeRemaining((prevTime) => prevTime - 1);
    }, 1000);

    return () => {
      if (intervalId.current) clearInterval(intervalId.current);
    };
  }, []);

  useEffect(() => {
    if (timeRemaining <= 0 && intervalId.current) {
      clearInterval(intervalId.current);
    }
  }, [timeRemaining]);

  const formatTime = () => {
    const hours = Math.floor(timeRemaining / 3600);
    const minutes = Math.floor((timeRemaining % 3600) / 60);
    const seconds = timeRemaining % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelected = (questionId: number, selectedAnswer: string) => {
      setAnswers((prevAnswers) => ({
        ...prevAnswers,
        [questionId]: selectedAnswer,
      }));
  };

  const handleSubmit = async () => {
      if (!mocktest_id) {
        console.error('No mocktest_id provided');
        return;
      }

      try {
        const response = await axios.post(`http://127.0.0.1:8000/mocktest/${mocktest_id}/submit/`, { answers });
        console.log(response.data);
        navigate(`/course/${course_id}/mocktest/${mocktest_id}/results`, {
           state: {
            score: response.data.score,
            total: response.data.total_questions,
            mocktestName: response.data.mocktestName,
            studentName: response.data.studentName,
            dateOfMocktest: response.data.dateOfMocktest
           }
        });
      } catch (error) {
        console.error('There was an error submitting the mock test.', error);
      }
  };

  return (
    <div className="mock-test">
        {mocktestDetail ? (
            <>
            <h1>{mocktestDetail?.mocktestName || 'Loading Test Name..'}</h1>
            <p className="subtitle">by BoardPrep Admin</p>
            <div className="exam-timer"> Time Remaining: {formatTime()} </div>
            <div className="surround">
            {questions && questions.length > 0 ? (
                questions.map((q, index) => (
                <MockTestCard
                    key={q.id}
                    question={q}
                    choices={[q.choiceA, q.choiceB, q.choiceC, q.choiceD]}
                    subject={q.subject}
                    onAnswerSelected={handleAnswerSelected}
                />
                ))
            ) : (
            <p>No questions available.</p>
            )}
            </div>
            </>
        ) : (
        <p>Loading test name...</p>
        )}
        <button className="submit-button" onClick={handleSubmit}>SUBMIT</button>
    </div>
  );
};

export default Mocktest;