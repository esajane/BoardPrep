import React, { useEffect, useState } from 'react'
import axios from 'axios'

interface Class {
  classId: number,
  className: string,
  classDescription: string,
  course: string,
  students: string[],
  classCode: string,
}

function Classes() {
  const [classes, setClasses] = useState<Class[]>([])

  const fetchClasses = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/classes/");
      setClasses(response.data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchClasses();
  })

  return (
    <div>
      <h1>Classes</h1>
      <div>
        {classes.map((classObj) => (
          <div key={classObj.classId}>
            <h2>{classObj.className}</h2>
            <p>{classObj.classDescription}</p>
            <p>{classObj.course}</p>
            <p>{classObj.students}</p>
            <p>{classObj.classCode}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Classes