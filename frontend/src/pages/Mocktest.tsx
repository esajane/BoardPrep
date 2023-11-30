import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import MockTestCard from '../components/Mocktestcard';
import '../styles/mocktest.scss';

// Define the structure of the question as it comes from the backend
interface MocktestDetail {
  mocktestID: number;
  mocktestName: string;
  mocktestDescription: string;
  // Add any other fields that are necessary
}

interface Question {
  id: number;
  question: string;
  choiceA: string;
  choiceB: string;
  choiceC: string;
  choiceD: string;
  subject: string;
  // Add any other fields that are necessary
}

const Mocktest: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [mocktestDetail, setMocktestDetails] = useState<MocktestDetail | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(3600);
  const intervalId = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
  // Fetch the details of the mock test
  axios.get('http://127.0.0.1:8000/mocktest/') // Replace <mocktest_id> with the actual ID
    .then(response => {
      setMocktestDetails(response.data[0]);
    })
    .catch(error => {
      console.error('There was an error fetching the mock test details', error);
    });

  // Fetch questions from the backend
  axios.get('http://127.0.0.1:8000/questions/')
    .then(response => {
      setQuestions(response.data);
    })
    .catch(error => {
      console.error('There was an error fetching the questions', error);
    });
}, []);


  // Timer setup
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

  return (
    <div className="mock-test">
      <h1>{mocktestDetail?.mocktestName || 'Loading test name...'}</h1>
      <p className="subtitle">by BoardPrep Admin</p>
      <div className="exam-timer">Time Remaining: {formatTime()}</div>
      <div className="surround">
          {questions.map((q, index) => (
            <MockTestCard
              key={q.id}
              question={`${index + 1}. ${q.question}`}
              choices={[q.choiceA, q.choiceB, q.choiceC, q.choiceD]}
              subject={q.subject}
            />
          ))}
      </div>
      <button className="submit-button">SUBMIT</button>
    </div>
  );
};

export default Mocktest;