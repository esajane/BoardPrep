import React from 'react'
import cardImage from '../assets/biomech.png'
import '../styles/class.scss'
import { Link } from 'react-router-dom'

interface ClassCardProps {
  classId: number,
  className: string,
  classDescription: string,
}

function ClassCard({ classId, className, classDescription }: ClassCardProps) {

  return (
    <div className="class-card">
      <img src={cardImage} className="logo" alt="RILL" />
      <div className="card-text">
        <p className="card-duration">1 - 28 July 2022</p>
        <p className="card-title">{ className }</p>
        <p className="card-description">
          { classDescription }
        </p>
        <Link to={`/classes/${classId}`} className="card-button">
          <button className="card-button">Classroom</button>
        </Link>
      </div>
    </div>
  )
}

export default ClassCard