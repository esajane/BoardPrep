import React, { FormEvent, useEffect, useRef, useState } from "react";
import axios from "axios";
import "../styles/coursemodal.scss";
import SyllabusModal from "./SyllabusModal"; // Import the new SyllabusModal
import LessonsModal from "./LessonsModal";

interface CourseModalProps {
  closeModal: () => void;
  course?: Course | null;
  onUpdateDashboard: () => void; // Added this prop for dashboard update
}

interface Course {
  course_id: string;
  course_title: string;
  short_description: string;
  long_description: string;
  image: string;
}

function CourseModal({ closeModal, course }: CourseModalProps) {
  const courseIdRef = useRef<HTMLInputElement>(null);
  const courseTitleRef = useRef<HTMLInputElement>(null);
  const shortDescriptionRef = useRef<HTMLTextAreaElement>(null);
  const longDescriptionRef = useRef<HTMLTextAreaElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);
  const [isSyllabusModalOpen, setIsSyllabusModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newCourseId, setNewCourseId] = useState("");
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [currentSyllabusId, setCurrentSyllabusId] = useState("");

  useEffect(() => {
    // Check if a course is provided (for editing) or not (for creating)
    if (course) {
      setIsEditing(true);
      // Fill in the form fields with the course data for editing
      if (courseIdRef.current) courseIdRef.current.value = course.course_id;
      if (courseTitleRef.current)
        courseTitleRef.current.value = course.course_title;
      if (shortDescriptionRef.current)
        shortDescriptionRef.current.value = course.short_description;
      if (longDescriptionRef.current)
        longDescriptionRef.current.value = course.long_description;
      // You may want to handle the image field separately
    }
  }, [course]);

  const handleSyllabusCreated = (syllabusId: string) => {
    setCurrentSyllabusId(syllabusId);
    setIsSyllabusModalOpen(false);
    setIsLessonModalOpen(true); // Open lesson modal after syllabus is created
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const courseId = courseIdRef.current?.value;
    const courseTitle = courseTitleRef.current?.value;
    const shortDescription = shortDescriptionRef.current?.value;
    const longDescription = longDescriptionRef.current?.value;
    const image = imageRef.current?.files?.[0] || null;

    try {
      let newCourseId;
      if (isEditing) {
        // Handle editing course logic here
        // You can make a PUT request to update the course with the provided data
        if (course) {
          const formData = new FormData();
          formData.append("course_id", course.course_id);
          formData.append("course_title", courseTitle || "");
          formData.append("short_description", shortDescription || "");
          if (image) formData.append("image", image);

          const response = await axios.put(
            `http://127.0.0.1:8000/courses/${course.course_id}/`, // Replace with your actual API endpoint
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          if (response.status === 200) {
            // Course edited successfully
            closeModal();
            // Add any additional logic you need (e.g., updating state)
          }
        }
      } else {
        // Handle creating course logic here
        const formData = new FormData();
        formData.append("course_id", courseId || "");
        formData.append("course_title", courseTitle || "");
        formData.append("short_description", shortDescription || "");
        if (image) formData.append("image", image);

        const response = await axios.post(
          "http://127.0.0.1:8000/courses/", // Replace with your actual API endpoint
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.status === 201 || response.status === 200) {
          setNewCourseId(response.data.course_id); // Update newCourseId state
          setIsSyllabusModalOpen(true);
        } else {
          closeModal(); // Close modal if editing or course creation didn't provide a course_id
        }
      }
    } catch (err) {
      console.error("Error in POST/PUT request:", err);
    }
  };

  const handleUpdateDashboard = () => {
    // Implement logic to update the dashboard here
    closeModal(); // Close the course modal after updating the dashboard
  };

  return (
    <div>
      <div className="modal-content">
        <div className="modal-header">
          <h1>{isEditing ? "Edit Course" : "Create Course"}</h1>
          <span className="close" onClick={closeModal}>
            &times;
          </span>
        </div>

        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Course ID" ref={courseIdRef} />
          <input type="text" placeholder="Course Title" ref={courseTitleRef} />
          <textarea placeholder="Short Description" ref={shortDescriptionRef} />
          <input type="file" accept="image/*" ref={imageRef} />
          <button type="submit">
            {isEditing ? "Save Changes" : "Create Course"}
          </button>
        </form>

        {isSyllabusModalOpen && (
          <SyllabusModal
            closeModal={() => setIsSyllabusModalOpen(false)}
            onSyllabusCreated={handleSyllabusCreated}
            course={isEditing ? course?.course_id ?? "" : newCourseId}
          />
        )}
        {isLessonModalOpen && (
          <LessonsModal
            closeModal={() => setIsLessonModalOpen(false)}
            onUpdateDashboard={handleUpdateDashboard}
            syllabusId={currentSyllabusId}
          />
        )}
      </div>
    </div>
  );
}

export default CourseModal;
