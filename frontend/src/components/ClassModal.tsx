import React, { FormEvent, useEffect, useRef, useState } from "react";
import Courselist from "../pages/Courselist";
import { useAppSelector } from "../redux/hooks";
import { selectUser } from "../redux/slices/authSlice";
import "../styles/class.scss";
import "../styles/course-list-popup.scss";
import axiosInstance from "../axiosInstance";

interface Class {
  classId: number;
  className: string;
  classDescription: string;
  course: string;
  image: string;
  teacher_name: string;
  students: string[];
  classCode: string;
}

interface ClassModalProps {
  closeModal: () => void;
  classes: Class[];
  setClasses: (classes: Class[]) => void;
}

interface Course {
  course_id: string;
  course_title: string;
  short_description: string;
  long_description: string;
  image: string;
  is_published: boolean;
}

function ClassModal({ closeModal, classes, setClasses }: ClassModalProps) {
  const user = useAppSelector(selectUser);
  const nameRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const [courseValue, setCourseValue] = useState("");
  const [selectedCourseTitle, setSelectedCourseTitle] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [showCourselist, setShowCourselist] = useState(false);
  const course = "Select Course";

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axiosInstance.get("/courses/");
        const filteredCourses = response.data.filter(
          (course: Course) => course.is_published
        );
        setCourses(filteredCourses);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  const toggleCourseList = () => {
    setShowCourselist(!showCourselist);
  };

  const handleCourseSelect = (
    selectedCourseId: string,
    selectedTitle: string
  ) => {
    setCourseValue(selectedCourseId);
    setSelectedCourseTitle(selectedTitle);
    setShowCourselist(false);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const name = nameRef.current?.value;
    const description = descriptionRef.current?.value;

    try {
      if (user.token.type === "T") {
        if (!name || !description) {
          console.error("Required fields are missing");
          return;
        }
        const response = await axiosInstance.post("/classes/", {
          className: name,
          classDescription: description,
          course: courseValue,
          teacher: user.token.id,
          students: [],
        });

        if (response.status === 201) {
          closeModal();
          setClasses([...classes, response.data]);
        }
      } else {
        if (!name) {
          console.error("Required fields are missing");
          return;
        }

        const postData = {
          class_code: name,
          student: user.token.id,
        };
        console.log("POST Data:", postData);

        const response = await axiosInstance.post("/join-requests/", postData);
        console.log("Response:", response);

        if (response.status === 201) {
          closeModal();
        }
      }
    } catch (err) {
      console.error("Error in POST request:", err);
    }
  };

  return (
    <div id="modal" className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h1>{user.token.type === "T" ? "Create Class" : "Join Class"}</h1>
          <span className="close" onClick={closeModal}>
            &times;
          </span>
        </div>

        {showCourselist && (
          <div className="flex-center">
            <div className="course-list-popup">
              <span className="popupclose" onClick={toggleCourseList}>
                &times;
              </span>
              <Courselist onSelectCourse={handleCourseSelect} />
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {user.token.type === "T" ? (
            <>
              <input type="text" placeholder="Class Name" ref={nameRef} />
              <textarea placeholder="Class Description" ref={descriptionRef} />
              <input
                type="text"
                placeholder="Select Course"
                onClick={toggleCourseList}
                readOnly
                value={selectedCourseTitle || "Select Course"}
              />
              <button type="submit">Create Class</button>{" "}
            </>
          ) : (
            <>
              <input type="text" placeholder="Class Code" ref={nameRef} />
              <button type="submit">Join Class</button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
export default ClassModal;
