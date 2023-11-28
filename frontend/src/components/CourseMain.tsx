import React from "react";
import "../styles/course.css";

interface CourseMainProps {
  id: string;
  title: string;
}

function CourseMain({ id, title }: CourseMainProps) {
  return (
    <div className="course-main-container">
      <div className="course-float">
        <h1>{title}</h1>
      </div>
      {/* Add more content as needed */}
    </div>
  );
}

export default CourseMain;
