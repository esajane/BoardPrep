import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'

interface Class {
  classId: number,
  className: string,
  classDescription: string,
  course: string,
  students: string[],
  classCode: string,
}

function Classroom() {
  const { id: classId } = useParams()
  const [classItem, setClass] = useState<Class[]>([])

  useEffect(() => {
    fetchClass();
  }, [])

  const fetchClass = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/classes/${classId}/`);
      setClass(response.data);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div>{classId}</div>
  )
}

export default Classroom