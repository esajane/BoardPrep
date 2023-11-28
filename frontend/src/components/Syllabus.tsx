import React from "react";
import "../styles/syllabus.css";
import { SyllabusList } from "../pages/CourseDetails";
import { Lessons } from "../pages/CourseDetails";

// Add props interface
interface SyllabusProps {
  syllabus: SyllabusList[];
  lessons: Lessons[];
}

function Syllabus({ syllabus, lessons }: SyllabusProps) {
  return (
    <div className="syllabus-main">
      {/* Render syllabus and lessons here */}
      {/* Example: */}
      <div className="syllabus-lhs">
        {syllabus.map((s) => (
          <div key={s.description}>
            <h1>Syllabus</h1>
            <p>{s.description}</p>
          </div>
        ))}
      </div>
      <div className="syllabus-container">
        {lessons.map((lesson) => (
          <div key={lesson.order} className="lesson-container">
            <h2>{lesson.lesson_title}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Syllabus;
