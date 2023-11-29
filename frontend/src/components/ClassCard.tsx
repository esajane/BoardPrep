import React from 'react'
import cardImage from '../assets/biomech.png'
import '../styles/class.css'

interface ClassCardProps {
  className: string,
  classDescription: string,
  students: string[],
}

function ClassCard({ className, classDescription, students }: ClassCardProps) {
  return (
    <div className="class-card">
      <img src={cardImage} className="logo" alt="RILL" />
      <div className="card-text">
        <p className="card-duration">1 - 28 July 2022</p>
        <p className="card-title">{ className }</p>
        <p className="card-description">
          { classDescription }
        </p>
        <button className="card-button">Classroom</button>
      </div>
    </div>
  )
}

export default ClassCard