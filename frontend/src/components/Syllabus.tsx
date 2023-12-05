import React from "react";
import "../styles/syllabus.scss";
import { SyllabusList } from "../pages/CourseDetails";
import { Lessons } from "../pages/CourseDetails";

interface SyllabusProps {
  syllabus: SyllabusList[];
  lessons: Lessons[];
}

function Syllabus({ syllabus, lessons }: SyllabusProps) {
  return (
    <div className="syllabus-main">
      <div className="syllabus-lhs">
        {syllabus.map((s) => (
          <div key={s.description}>
            <h1>Syllabus</h1>
            <p>{s.description}</p>
          </div>
        ))}
        <button></button>
      </div>
      <div className="syllabus-container">
        {lessons.map((lesson) => (
          <div key={lesson.order} className="lesson-container">
            <h2>{lesson.lesson_title}</h2>
          </div>
        ))}
      </div>
      <button></button>
    </div>
  );
}

export default Syllabus;
