import React from 'react';
import "../styles/mocktestCard.scss";

export interface Question {
  id: number;
  question: string;
  choiceA: string;
  choiceB: string;
  choiceC: string;
  choiceD: string;
  subject: string;
}

interface MockTestCardProps {
  question: Question;
  subject: string;
  choices: string[];
  onAnswerSelected: (questionId: number, selectedAnswer: string) => void;
}

const MockTestCard: React.FC<MockTestCardProps> = ({ question, choices, onAnswerSelected }) => {
  return (
      <div className="mock-test-card">
        <div className="question">{question.question}</div>
        <div className="options">
          {choices.map((option, index) => (
            <div className="custom-radio" key={index}>
              <input
                type="radio"
                id={`choice-${option}`}
                name={`question-${question.id}`} // Unique name for each question
                value={option}
                onChange={(e) => onAnswerSelected(question.id, e.target.value)}
                className="radio-input"
              />
              <label htmlFor={`choice-${option}`}>{option}</label>
            </div>
          ))}
        </div>
      </div>
  );
};

export default MockTestCard;
