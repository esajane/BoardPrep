import React, { useEffect, useState } from "react";
import axios from "axios";
import CourseCard from "../components/Coursecard";
import "../styles/testing.css";

interface Course {
  course_id: string;
  course_title: string;
  short_description: string;
  image: string;
}

function CourseList() {
  const [courses, setCourses] = useState<Course[]>([]);

  const fetchCourses = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/courses/");
      setCourses(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <>
      <div className="coursecards-container">
        {courses.map((course) => (
          <CourseCard
            key={course.course_id}
            id={course.course_id}
            course_title={course.course_title}
            image={course.image}
            short_description={course.short_description}
          />
        ))}
      </div>
    </>
  );
}

export default CourseList;
