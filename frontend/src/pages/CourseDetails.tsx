import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/details.scss";
import SyllabusComponent from "../components/Syllabus";
import CourseMain from "../components/CourseMain";
import { useParams } from "react-router-dom";

interface Course {
  course_id: string;
  course_title: string;
  image: string;
  long_description: string;
}

export interface SyllabusList {
  description: string;
}

export interface Lessons {
  order: number;
  lesson_title: string;
}

function CourseDetails() {
  const { id } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [syllabus, setSyllabus] = useState<SyllabusList[]>([]);
  const [lessons, setLessons] = useState<Lessons[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const courseResponse = await axios.get(
          `http://127.0.0.1:8000/course/details/${id}/`
        );
        const syllabusResponse = await axios.get(
          `http://127.0.0.1:8000/syllabi/${id}/`
        );
        const lessonsResponse = await axios.get(
          `http://127.0.0.1:8000/lessons/?course_id=${id}/`
        );

        setCourse(courseResponse.data);
        setSyllabus(syllabusResponse.data);
        setLessons(lessonsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  if (!course) {
    return <div>Loading...</div>; // or any other loading state representation
  }

  return (
    <div className="details-container">
      <div className="img">
        <img src={course.image} alt={course.course_title} />
      </div>
      <CourseMain
        id={course.course_id}
        title={course.course_title}
        description={course.long_description}
      />
      <SyllabusComponent syllabus={syllabus} lessons={lessons} />
    </div>
  );
}

export default CourseDetails;
