import React, { FormEvent, useEffect, useState, useRef } from "react";
import axios from "axios";

interface Lesson {
  lesson_id: string;
  lesson_title: string;
  order: number;
  syllabus: string;
}

interface LessonModalProps {
  closeModal: () => void;
  onUpdateDashboard: () => void;
  syllabusId: string;
}

function LessonModal({
  closeModal,
  onUpdateDashboard,
  syllabusId,
}: LessonModalProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [lessons, setLessons] = useState([]);
  const newLessonIdRef = useRef<HTMLInputElement>(null);
  const updateLessonIdRef = useRef<HTMLSelectElement>(null);
  const lessonTitleRef = useRef<HTMLInputElement>(null);
  const orderRef = useRef<HTMLInputElement>(null);
  const [action, setAction] = useState("create");

  useEffect(() => {
    if (isUpdating) {
      // Fetch lessons for the dropdown when updating
      const fetchLessons = async () => {
        try {
          const response = await axios.get(
            `http://127.0.0.1:8000/lessons/by_syllabus/${syllabusId}/`
          );
          setLessons(response.data); // Assuming response.data contains an array of lessons
        } catch (error) {
          console.error("Error fetching lessons:", error);
        }
      };

      fetchLessons();
    }
  }, [isUpdating, syllabusId]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const lessonTitle = lessonTitleRef.current?.value;
    const order = orderRef.current?.value;
    let response;

    if (isUpdating) {
      const selectedLessonId = updateLessonIdRef.current?.value;
      // Update existing lesson (PUT request)
      response = await axios.put(
        `http://127.0.0.1:8000/lessons/${selectedLessonId}/`,
        {
          lesson_id: selectedLessonId,
          lesson_title: lessonTitle,
          order: order,
          syllabus: syllabusId,
        }
      );
    } else {
      const newLessonId = newLessonIdRef.current?.value;
      // Create new lesson (POST request)
      response = await axios.post("http://127.0.0.1:8000/lessons/", {
        lesson_id: newLessonId,
        lesson_title: lessonTitle,
        order: order,
        syllabus: syllabusId,
      });
    }

    if (response && (response.status === 200 || response.status === 201)) {
      onUpdateDashboard();
      closeModal();
    }
  };

  return (
    <div className="modal-content">
      <div className="modal-header">
        <h1>{isUpdating ? "Update Lesson" : "Create Lesson"}</h1>
        <span className="close" onClick={closeModal}>
          &times;
        </span>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-radio-buttons">
          <label className="radio-label">
            <input
              type="radio"
              name="action"
              checked={!isUpdating}
              onChange={() => setIsUpdating(false)}
            />
            New Lesson
          </label>
          <label className="radio-label">
            <input
              type="radio"
              name="action"
              checked={isUpdating}
              onChange={() => setIsUpdating(true)}
            />
            Update Lesson
          </label>
        </div>
        {isUpdating ? (
          <select ref={updateLessonIdRef}>
            {lessons.map((lesson: Lesson) => (
              <option key={lesson.lesson_id} value={lesson.lesson_id}>
                {lesson.lesson_title}
              </option>
            ))}
          </select>
        ) : (
          <input type="text" placeholder="New Lesson ID" ref={newLessonIdRef} />
        )}
        <input type="text" placeholder="Lesson Title" ref={lessonTitleRef} />
        <input type="text" placeholder="Order" ref={orderRef} />
        <button type="submit">
          {isUpdating ? "Update Lesson" : "Create Lesson"}
        </button>
      </form>
    </div>
  );
}

export default LessonModal;
