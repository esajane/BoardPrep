import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../styles/syllabus.scss";
import { useAppSelector } from "../redux/hooks";
import { selectUser } from "../redux/slices/authSlice";

interface Lessons {
  order: number;
  lesson_title: string;
  lesson_id: string;
}

interface ClassData {
  classID: string;
  course: string;
  className: string;
  hasMocktest: boolean;
}

interface SyllabusProps {
  syllabus?: { syllabus_id: string }[];
  lessons: Lessons[];
  onLessonClick: (lessonContent: string) => void;
}

function Syllabus({ syllabus = [], lessons, onLessonClick }: SyllabusProps) {
  const [currentLessonContent, setCurrentLessonContent] = useState("");
  const [loadingContent, setLoadingContent] = useState(false);
  const [error, setError] = useState("");
  const user = useAppSelector(selectUser);
  const userType = user.token.type;
  const { courseId, classID } = useParams<{ courseId: string; classID: string }>();
  const [hasMocktest, setHasMocktest] = useState(false);
  const [fetchedContents, setFetchedContents] = useState<{
    [key: string]: string;
  }>({});

  const navigate=useNavigate();

  const onClickMockTest=() => {
      const path = window.location.pathname;
      console.log(path.split("/")[2]);
      const classID = path.split("/")[2];
      console.log(courseId);
      if (userType != 'S' && userType != 'T') {
        navigate(`/courses/${courseId}/mocktest/create`);
      } else {
        navigate(`/classes/${classID}/mocktest`);
      }
  };

  const onClickViewMockTest=() => {
      navigate(`/courses/${courseId}/mocktest`);
  };

  const fetchLessonContent = async (lessonId: string) => {
    if (fetchedContents[lessonId]) {
      setCurrentLessonContent(fetchedContents[lessonId]);
      onLessonClick(fetchedContents[lessonId]);
      return;
    }

    setLoadingContent(true);
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/pages/${lessonId}/1`
      );
      const newContent = response.data.content;
      setCurrentLessonContent(newContent);
      setFetchedContents({ ...fetchedContents, [lessonId]: newContent });
      onLessonClick(newContent);
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        // No page found for this lesson, prepare to create a new page
        setCurrentLessonContent(""); // Set empty content for new page
        onLessonClick(""); // Pass empty content to parent component
      } else {
        console.error("Error fetching lesson content", error);
        setError("Failed to load lesson content");
      }
    } finally {
      setLoadingContent(false);
    }
  };

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/classes/`);
        const classData: ClassData[] = response.data;
        console.log(classData);
        const currentClass = classData.find(cls => cls.course === courseId);
        console.log(currentClass);
        if (currentClass && currentClass.hasMocktest) {
            setHasMocktest(true);
        } else {
            setHasMocktest(false);
        }
      } catch (error) {
        console.error("Error fetching class data", error);
      }
    };

    fetchClassData();
  }, [classID]);

  return (
    <div className="syllabus-container">
      {lessons.map((lesson) => (
        <div
          key={lesson.lesson_id}
          className="title-container"
          onClick={() => onLessonClick(lesson.lesson_id)}
          role="button"
          tabIndex={0}
        >
          <h2>{lesson.lesson_title}</h2>
        </div>
      ))}
      <div className="title-container" tabIndex={0} onClick={onClickMockTest}>
         <h2>{userType === 'S'? 'Take Mock Test' : userType === 'T' ? 'View Mock Test' : hasMocktest ? 'Edit Mock Test' : 'Create Mock Test'}</h2>
      </div>
      {userType === 'C' && hasMocktest && (
         <div className="title-container" tabIndex={0} onClick={onClickViewMockTest}>
           <h2>View Mock Test</h2>
         </div>
      )}
    </div>
  );
}

export default Syllabus;
