import React from 'react';
import "../styles/mocktestCard.scss";

interface MockTestCardProps {
  question: string;
  subject: string;
  choices: string[];
}

// MockTestCard.tsx:
const MockTestCard: React.FC<MockTestCardProps> = ({ question, choices }) => {
  return (
      <div className="mock-test-card">
        <div className="question">{question}</div>
        <div className="options">
          {choices.map((option, index) => (
            <div className="custom-radio" key={index}>
              <input
                type="radio"
                id={`choice-${option}`}
                name={question} // Unique name for each question
                value={option}
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
