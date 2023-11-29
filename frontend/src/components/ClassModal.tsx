import React, { FormEvent, useRef } from 'react'
import axios from 'axios';
import '../styles/class.css'

interface ClassModalProps {
  closeModal: () => void;
  fetchClasses: () => void;
}

function ClassModal({ closeModal, fetchClasses }: ClassModalProps) {
  const nameRef = useRef<HTMLInputElement>(null)
  const descriptionRef = useRef<HTMLTextAreaElement>(null)
  const courseRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const name = nameRef.current?.value
    const description = descriptionRef.current?.value
    const course = courseRef.current?.value

    try {
      const response = await axios.post("http://127.0.0.1:8000/classes/", {
        className: name,
        classDescription: description,
        course: course, // TODO: replace with actual course
        teacher: 'teacher1' // TODO: replace with actual teacher
      })
      if (response.status === 201) {
        closeModal()
        fetchClasses()
      } else {
        console.log(response)
      }
    } catch(err) {
      console.error(err)
    }
  }
  
  return (
    <div id="modal" className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h1>Create Class</h1>
          <span className="close" onClick={closeModal}>&times;</span>
        </div>
        <form onSubmit={handleSubmit}>
          <input type="text"placeholder='Class Name' ref={nameRef} />
          <textarea placeholder='Class Description' ref={descriptionRef} />
          <input type="text" placeholder='Course' ref={courseRef} />
          <button type="submit" className="card-button">Create</button>
        </form>
      </div>
    </div>
  )
}

export default ClassModal