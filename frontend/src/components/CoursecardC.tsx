import React from "react";
import "../styles/coursecard.scss";

interface CourseCardProps {
  id: string;
  course_title: string;
  short_description: string;
  image: string;
  onSelectCourse: (courseId: string, courseTitle: string) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({
  id,
  course_title,
  short_description,
  image,
  onSelectCourse,
}) => {
  const handleSelectCourse = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onSelectCourse(id, course_title);
  };

  return (
    <div className="coursecard">
      <div className="imagebox">
        <img src={image} alt={course_title} className="img" />
      </div>
      <div className="defbox">
        <h3>{course_title}</h3>
        <p>{short_description}</p>
      </div>
      <button className="interactive-button" onClick={handleSelectCourse}>
        Edit Course
      </button>
    </div>
  );
};

export default CourseCard;
