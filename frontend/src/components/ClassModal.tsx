import React, { FormEvent, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useAppSelector } from "../redux/hooks";
import { selectUser } from "../redux/slices/authSlice";
import "../styles/class.scss";

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
  syllabus: number;
  course_title: string;
  short_description: string;
  long_description: string;
  image: string;
}

function ClassModal({ closeModal, classes, setClasses }: ClassModalProps) {
  const user = useAppSelector(selectUser);
  const nameRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const [courseValue, setCourseValue] = useState("");
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/course/details/"
        );
        setCourses(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCourses();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCourseValue(e.target.value);
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

        const response = await axios.post("http://127.0.0.1:8000/classes/", {
          className: name,
          classDescription: description,
          course: courseValue,
          teacher: user.token.id,
          students: ["student1"],
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
        const response = await axios.post(
          "http://127.0.0.1:8000/join-requests/",
          {
            class_code: name,
            student: user.token.id,
          }
        );
        if (response.status === 201) {
          closeModal();
        }
      }
    } catch (err) {
      console.error(err);
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
        <form onSubmit={handleSubmit}>
          {user.token.type === "T" ? (
            <>
              <input type="text" placeholder="Class Name" ref={nameRef} />
              <textarea placeholder="Class Description" ref={descriptionRef} />
              <select value={courseValue} onChange={handleChange}>
                <option value="">Select a course</option>
                {courses.map((course: Course) => (
                  <option key={course.course_id} value={course.course_id}>
                    {course.course_title}
                  </option>
                ))}
              </select>
              <button type="submit">Create Class</button>
            </>
          ) : (
            <>
              <input type="text" placeholder="Class Code" />
              <button type="submit">Join Class</button>
            </>
          )}
        </form>
      </div>
    </div>
  );

  return (
    <div id="modal" className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h1>{user.token.type === "T" ? "Create Class" : "Join Class"}</h1>
          <span className="close" onClick={closeModal}>
            &times;
          </span>
        </div>
        <form onSubmit={handleSubmit}>
          {user.token.type === "T" ? (
            <>
              <input type="text" placeholder="Class Name" ref={nameRef} />
              <textarea placeholder="Class Description" ref={descriptionRef} />
              <select value={courseValue} onChange={handleChange}>
                <option value="">Select a course</option>
                {courses.map((course: Course) => (
                  <option key={course.course_id} value={course.course_id}>
                    {course.course_title}
                  </option>
                ))}
              </select>
            </>
          ) : (
            <input type="text" placeholder="Class Code" ref={nameRef} />
          )}
          <button type="submit" className="card-button">
            Create
          </button>
        </form>
      </div>
    </div>
  );
}

export default ClassModal;
