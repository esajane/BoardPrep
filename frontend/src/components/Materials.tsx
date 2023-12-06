import React, { useEffect, useState } from "react";
import axios from "axios";
import Syllabus from "./Syllabus";
import LessonContent from "./Lessons";

import "../styles/materials.scss";

interface Lesson {
  lesson_id: string;
  lesson_title: string;
  order: number;
  content: string;
  syllabus: string;
}

interface MaterialsProps {
  courseId: string;
}

function Materials({ courseId }: MaterialsProps) {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentLesson, setCurrentLesson] = useState<string | null>(null);
  const [isSyllabusCollapsed, setIsSyllabusCollapsed] = useState(false);

  useEffect(() => {
    const fetchSyllabus = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/syllabi/${courseId}/`
        );
        const syllabusData = response.data[0];
        setLessons(syllabusData.lessons);
      } catch (error) {
        console.error("Error fetching syllabus:", error);
      }
    };

    if (courseId) {
      fetchSyllabus();
    }
  }, [courseId]);

  const handleCheckboxChange = () => {
    setIsSyllabusCollapsed(!isSyllabusCollapsed);
  };

  return (
    <div className={`materials-page ${isSyllabusCollapsed ? "collapsed" : ""}`}>
      <input
        type="checkbox"
        id="checkbox"
        className="checkbox"
        checked={isSyllabusCollapsed}
        onChange={handleCheckboxChange}
      />
      <label htmlFor="checkbox" className="toggle">
        <div className="bars" id="bar1"></div>
        <div className="bars" id="bar2"></div>
        <div className="bars" id="bar3"></div>
      </label>

      <div
        className={`syllabus-main ${isSyllabusCollapsed ? "collapsed" : ""}`}
      >
        <Syllabus lessons={lessons} onLessonClick={setCurrentLesson} />
      </div>

      <div className="lesson-content-container">
        {currentLesson ? (
          <LessonContent content={currentLesson} />
        ) : (
          <div>Select a lesson to view its content.</div>
        )}
      </div>
    </div>
  );
}

export default Materials;
