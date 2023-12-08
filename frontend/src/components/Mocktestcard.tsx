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
  difficulty: string;
}

interface MockTestCardProps {
  noOfQuestions: number;
  question: Question;
  subject: string;
  difficulty: string;
  choices: string[];
  onAnswerSelected: (questionId: number, selectedAnswer: string) => void;
}

const MockTestCard: React.FC<MockTestCardProps> = ({ noOfQuestions, question, subject, difficulty, choices, onAnswerSelected }) => {
  return (
      <div className="mock-test-card">
        <div className="questionAndSubjectAndDifficulty">
            <div className="question">
                <span className="questionNumbers">{noOfQuestions}.</span> {question.question}
            </div>
            <div className="subjectAndDifficulty">
                <div className={difficulty == 'Easy' ? 'difficultyBoxEasy' : difficulty == 'Medium' ? 'difficultyBoxMedium' : 'difficultyBoxHard'}>
                    <div className="difficulty">
                        <p className="difficultyWord">{difficulty}</p>
                    </div>
                </div>
                <div className="subjectBox">
                    <div className="subject">
                        <p className="subjectWord">{subject}</p>
                    </div>
                </div>
            </div>
        </div>
        <div className="options">
          {choices.map((option, index) => (
            <div className="custom-radio" key={index}>
              <input
                type="radio"
                id={`choice-${option}-${question.id}`}
                name={`question-${question.id}`}
                value={option}
                onChange={(e) => onAnswerSelected(question.id, e.target.value)}
                className="radio-input"
              />
              <label htmlFor={`choice-${option}-${question.id}`}>{option}</label>
            </div>
          ))}
        </div>
      </div>
  );
};

export default MockTestCard;
