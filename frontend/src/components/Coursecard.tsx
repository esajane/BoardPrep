import "../styles/testing.scss";
import React from "react";
import { Link } from "react-router-dom";

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
    <Link to={`/course/${id}`} className="coursecard-link">
      <div className="coursecard">
        <div className="imagebox">
          <img src={image} alt={course_title} className="img" />
        </div>
        <div className="defbox">
          <h3>{course_title}</h3>
          <p>{short_description}</p>
        </div>
      </div>
    </Link>
  );
}

export default CourseCard;
