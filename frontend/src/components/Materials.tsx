import React, { useEffect, useState } from "react";
import axios from "axios";

interface Course {
  course_id: string;
  course_title: string;
  image: string;
  long_description: string;
}

interface MaterialsProps {
  courseId: string;
}

function Materials({ courseId }: MaterialsProps) {
  const [courseDetails, setCourseDetails] = useState<Course | null>(null);

  useEffect(() => {
    if (courseId) {
      axios
        .get(`http://127.0.0.1:8000/course/details/${courseId}/`)
        .then((response) => {
          setCourseDetails(response.data);
        })
        .catch((error) => {
          console.error("Error fetching course details:", error);
        });
    }
  }, [courseId]);

  if (!courseDetails) {
    return <div>Loading course details...</div>;
  }

  return (
    <div>
      <h1>{courseDetails.course_title}</h1>
      <img src={courseDetails.image} alt="Course" />
      <p>{courseDetails.long_description}</p>
    </div>
  );
}

export default Materials;
