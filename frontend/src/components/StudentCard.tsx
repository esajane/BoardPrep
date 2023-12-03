import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { IoMdCheckmark, IoMdClose } from "react-icons/io";

import '../styles/studentcard.scss'
import profileImage from '../assets/16.png'

interface Student {
  "user_name": string,
  "password": string,
  "first_name": string,
  "last_name": string,
  "email": string,
  "registration_date": string,
  "last_login": string,
  "specialization": number,
  "institution_id": number,
  "subscription": number
}

interface StudentCardProps {
  classId: number;
  studentId: string;
  is_accepted: boolean;
  requestId?: number;
  fetchClass?: () => void;
}

function StudentCard({ classId, studentId, is_accepted, requestId, fetchClass }: StudentCardProps) {
  const [student, setStudent] = useState<Student>();
  const [acceptColor, setAcceptColor] = useState('#08d46c');
  const [rejectColor, setRejectColor] = useState('#e04434');
  const [isAccepted, setIsAccepted] = useState(is_accepted);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/student/${studentId}/`);
        setStudent(response.data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchStudent();
  }, [studentId])

  const handleAccept = async () => {
    try {
      await axios.post(`http://127.0.0.1:8000/classes/${classId}/accept-join-request/`, {
        join_request_id: requestId
      });
      setIsAccepted(true);
      if(fetchClass) {
        fetchClass();
      }
    } catch (err) {
      console.error(err);
    }
  }

  const handleAcceptEnter = () => {
    setAcceptColor('#ffffff');
  }

  const handleAcceptLeave = () => {
    setAcceptColor('#08d46c');
  }

  const handleRejectEnter = () => {
    setRejectColor('#ffffff');
  }

  const handleRejectLeave = () => {
    setRejectColor('#e04434');
  }

  return (
    <tr className='student-card'>
      <td>
        <div className="student-card__name">
          <div className="student-card__name--pic">
            <img src={profileImage} className="logo" alt="RILL" />
          </div>
          {`${student?.first_name} ${student?.last_name}`}
        </div>
      </td>
      <td>{student?.specialization}</td>
      <td>{student?.institution_id}</td>
      <td>
        {!isAccepted && 
        <div className="student-card__req-buttons">
          <button className="accept request_btn" onClick={handleAccept} onMouseEnter={handleAcceptEnter} onMouseLeave={handleAcceptLeave}>
            <IoMdCheckmark color={acceptColor} />
          </button>
          <button className="reject request_btn" onMouseEnter={handleRejectEnter} onMouseLeave={handleRejectLeave}>
            <IoMdClose color={rejectColor} />
          </button>
        </div>}
      </td>
    </tr>
  );
}

export default StudentCard;
