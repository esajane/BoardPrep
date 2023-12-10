// SyllabusModal.js

import React, { FormEvent, useRef } from "react";
import axios from "axios";

interface Syllabus {
  syllabusId: string;
  course: string;
}

interface SyllabusModalProps {
  closeModal: () => void;
  onSyllabusCreated: (syllabusId: string) => void;
  course: string;
}

function SyllabusModal({
  closeModal,
  onSyllabusCreated,
  course,
}: SyllabusModalProps) {
  const syllabusIdRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const syllabusId = syllabusIdRef.current?.value || "";

    try {
      console.log("course prop in SyllabusModal:", course);
      const response = await axios.post("http://127.0.0.1:8000/syllabi/", {
        syllabus_id: syllabusId,
        course: course,
      });

      if (response.status === 201) {
        onSyllabusCreated(syllabusId);
        closeModal();
      }
    } catch (error) {
      console.error("Error creating syllabus:", error);
    }
  };

  return (
    <div className="modal-content">
      {/* Modal Content */}
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Syllabus ID" ref={syllabusIdRef} />
        <button type="submit">Create Syllabus</button>
      </form>
    </div>
  );
}

export default SyllabusModal;
