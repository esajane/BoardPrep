import React, { useEffect, useState, useRef} from 'react';
import axios from 'axios';
import MockTestCard from '../components/Mocktestcard';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector } from "../redux/hooks";
import { selectUser } from "../redux/slices/authSlice";
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
  difficulty: string;
}

const Mocktest: React.FC = () => {
  const user = useAppSelector(selectUser);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [mocktestDetail, setMocktestDetails] = useState<MocktestDetail | null>(null);
  const [mocktest_id, setMocktestID] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(3600);
  const [answers, setAnswers] = useState({});
  const intervalId = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  const { course_id, classID } = useParams<{ course_id: string; classID: string }>();

  useEffect(() => {
    if(classID) {
        axios.get(`http://127.0.0.1:8000/mocktest/?classID=${classID}`)
        .then(response => {
          if(response.data.length > 0) {
            const fetchedMocktest = response.data[0];
            setMocktestDetails(fetchedMocktest);
            setMocktestID(fetchedMocktest.mocktestID);
          } else {
            console.error('No mocktest found for this course.');
          }
        })
        .catch(error => {
          console.error('There was an error fetching the mock test details.', error);
        });
    }
  }, [classID]);

  useEffect(() => {
    if(mocktest_id) {
        axios.get(`http://127.0.0.1:8000/questions/?mocktest_id=${mocktest_id}`)
        .then(response => {
          if(response.data.length > 0) {
            const fetchedMocktest = response.data[0];
            setQuestions(response.data);
          } else {
            console.error('No mocktest found for this course.');
          }
        })
        .catch(error => {
          console.error('There was an error fetching the mock test details.', error);
        });
    }
  }, [mocktest_id]);


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
      setAnswers((prevAnswers) => {
        const updatedAnswers = { ...prevAnswers, [questionId]: selectedAnswer };
        console.log("Updated Answers: ", updatedAnswers);
        return updatedAnswers;
      });
  };

  const handleSubmit = async () => {
      if (!mocktest_id || !mocktestDetail) {
        console.error('No mocktest ID or mocktest detail provided.');
        return;
      }

      if(!user.token.id) {
        console.error('No token found.');
        return;
      }
      console.log("Using token for request:", user.token.id);

      try {
        if(user.isAuth) {
            const response = await axios.post(`http://127.0.0.1:8000/mocktest/${mocktest_id}/submit`,
                {
                    user_name: user.token.id,
                    answers: answers
                },
            );
            console.log("Response:", response.data);
            navigate(`/classes/${classID}/mocktest/${mocktest_id}/results`, {
               state: {
                classID: classID,
                mocktest_id: mocktest_id,
                score: response.data.score,
                total: response.data.total_questions,
                mocktestName: response.data.mocktestName,
                studentName: response.data.studentName,
                feedback: response.data.feedback,
                dateOfMocktest: response.data.mocktestDateTaken,
               }
            });
        }
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
                    noOfQuestions={index + 1}
                    question={q}
                    difficulty={q.difficulty}
                    choices={[q.choiceA, q.choiceB, q.choiceC, q.choiceD]}
                    subject={q.subject}
                    onAnswerSelected={handleAnswerSelected}
                />
                ))
            ) : (
            <p>No questions available.</p>
            )}
            <button className="submit-button" onClick={handleSubmit}>SUBMIT</button>
            </div>
            </>
        ) : (
        <p>Loading test name...</p>
        )}

    </div>
  );
};

export default Mocktest;