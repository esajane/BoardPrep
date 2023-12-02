import React from 'react'
import '../styles/studentstab.scss'

interface StudentsTabProps {
  students: string[],
}

function StudentsTab({ students }: StudentsTabProps) {
  return (
    <div className='students-tab'>
      <div className="students-tab--center">
        { students.length > 0 ? 
          students.map((student) => {
            return (
              <div>{student}</div>
            ) 
          }) :
          <p>No students yet.</p>
        }
      </div>
    </div>
  )
}

export default StudentsTab