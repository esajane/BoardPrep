import React from "react";
import "../styles/class.scss";
import { Link } from "react-router-dom";

interface Class {
  classId: number;
  className: string;
  classDescription: string;
  teacher_name: string;
  course: string;
  image: string;
  students: string[];
  classCode: string;
}

interface ClassCardProps {
  class: Class;
}

function ClassCard({ class: classItem }: ClassCardProps) {
  return (
    <div className="class-card">
      <img
        src={`http://127.0.0.1:8000${classItem.image}`}
        className="logo"
        alt="RILL"
      />
      <div className="card-text">
        <div>
          <p className="card-title">{classItem.className}</p>
          <p className="card-duration">{classItem.teacher_name}</p>
          <p className="card-description">{classItem.classDescription}</p>
        </div>
        <Link to={`/classes/${classItem.classId}`} className="card-button">
          <button className="card-button">Classroom</button>
        </Link>
      </div>
    </div>
  );
}

export default ClassCard;
