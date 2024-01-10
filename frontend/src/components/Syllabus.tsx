import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../styles/syllabus.scss";
import { useAppSelector } from "../redux/hooks";
import { selectUser } from "../redux/slices/authSlice";
import axiosInstance from "../axiosInstance";

interface Lessons {
  order: number;
  lesson_title: string;
  lesson_id: string;
}

interface CourseData {
  course_id: string;
  hasMocktest: boolean;
}

interface ClassData {
  classId: number;
  course: string;
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
  const { courseId } = useParams<{
    courseId: string;
  }>();
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [courseIdForUser, setCourseIdForUser] = useState<string | null>(null);
  const [hasMocktest, setHasMocktest] = useState(false);
  const [fetchedContents, setFetchedContents] = useState<{
    [key: string]: string;
  }>({});

  const navigate = useNavigate();

  const classPath = window.location.pathname;
  console.log(classPath.split("/")[2]);
  const classId = classPath.split("/")[2];

  const onClickMockTest = () => {
    const path = userType === 'S' || userType === 'T' ? `/classes/${classId}/mocktest/${courseIdForUser}` : `/courses/${courseId}/mocktest/create`;
    navigate(path);
  };

  const onClickViewMockTest = () => {
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
      const response = await axiosInstance.get(`/pages/${lessonId}/1`);
      const newContent = response.data.content;
      setCurrentLessonContent(newContent);
      setFetchedContents({ ...fetchedContents, [lessonId]: newContent });
      onLessonClick(newContent);
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        setCurrentLessonContent("");
        onLessonClick("");
      } else {
        console.error("Error fetching lesson content", error);
        setError("Failed to load lesson content");
      }
    } finally {
      setLoadingContent(false);
    }
  };

  useEffect(() => {
    const fetchCourseDataForUser = async () => {
      if ((userType === 'S' || userType === 'T') && !courseId) {
        try {
          const response = await axiosInstance.get(`/classes/${classId}`);
          const classData = response.data;
          console.log(classData);
          console.log(classData.course);

          if (classData && classData.course) {
            setCourseIdForUser(classData.course);
          } else {
            console.error(`No course found for class ID: ${classId}`);
          }
        } catch (error) {
           console.error('Error fetching course data for user:', error);
        }
      }
    };

    fetchCourseDataForUser();
  }, [userType, classId]);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await axiosInstance.get(`/courses/`);
        const courseData: CourseData[] = response.data;
        console.log(courseData);
        const currentCourse = courseData.find((crs) => crs.course_id === courseId);
        console.log(currentCourse);
        if (currentCourse) {
            setSelectedCourseId(currentCourse.course_id);
            setHasMocktest(currentCourse.hasMocktest);
        } else {
            setSelectedCourseId(null);
            setHasMocktest(false);
        }
      } catch (error) {
        console.error("Error fetching class data", error);
      }
    };

    fetchCourseData();
  }, []);

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
        <h2>
          {userType === "S"
            ? "Take Mock Test"
            : userType === "T"
            ? "View Mock Test"
            : hasMocktest
            ? "Edit Mock Test"
            : "Create Mock Test"}
        </h2>
      </div>
      {userType === "C" && hasMocktest && (
        <div
          className="title-container"
          tabIndex={0}
          onClick={onClickViewMockTest}
        >
          <h2>View Mock Test</h2>
        </div>
      )}
    </div>
  );
}

export default Syllabus;
