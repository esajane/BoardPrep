import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/details.css";
import SyllabusComponent from "../components/Syllabus";
import CourseMain from "../components/CourseMain";

// Define interfaces for your data types
interface Course {
  course_id: string;
  course_title: string;
  image: string;
}

export interface SyllabusList {
  description: string;
}

export interface Lessons {
  order: number;
  lesson_title: string;
  content: string;
}

function CourseDetails() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [syllabus, setSyllabus] = useState<SyllabusList[]>([]);
  const [lessons, setLessons] = useState<Lessons[]>([]);

  // Fetch courses, syllabus, and lessons
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseResponse, syllabusResponse, lessonsResponse] =
          await Promise.all([
            axios.get("http://127.0.0.1:8000/courses/"),
            axios.get("http://127.0.0.1:8000/syllabi/"),
            axios.get("http://127.0.0.1:8000/lessons/"),
          ]);

        setCourses(courseResponse.data);
        setSyllabus(syllabusResponse.data);
        setLessons(lessonsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="details-container">
      {courses.map((course) => (
        <div key={course.course_id}>
          <div className="img">
            <img src={course.image} alt={course.course_title} />
          </div>
          <CourseMain id={course.course_id} title={course.course_title} />
        </div>
      ))}
      <SyllabusComponent syllabus={syllabus} lessons={lessons} />
    </div>
  );
}

export default CourseDetails;
