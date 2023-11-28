import "../styles/testing.css";
import React from "react";

interface CourseCardProps {
  id: string;
  course_title: string;
  short_description: string;
  image: string;
}

function CourseCard({
  id,
  course_title,
  short_description,
  image,
}: CourseCardProps) {
  return (
    <a href={`/course/${id}`} className="coursecard-link">
      <div className="coursecard">
        <div className="imagebox">
          <img src={image} alt={course_title} className="img" />
        </div>
        <div className="defbox">
          <h3>{course_title}</h3>
          <p>{short_description}</p>
        </div>
      </div>
    </a>
  );
}

export default CourseCard;
