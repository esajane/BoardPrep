import React from 'react';
import StudentCard from './StudentCard';
import '../styles/studentstab.scss'

interface JoinRequest {
  id: number;
  is_accepted: boolean;
  class_instance: number;
  student: string;
}

interface StudentsTabProps {
  classId: number;
  joinRequests: JoinRequest[];
  students: string[];
  fetchClass: () => void;
}

function StudentsTab({ classId, joinRequests, students, fetchClass }: StudentsTabProps) {
  return (
    <div className='students-tab'>
      <div className="students-tab--center">
        {students.length + joinRequests.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Specialization</th>
                <th>Institution</th>
                <th>Join Request</th>
              </tr>
            </thead>
            <tbody>
              {joinRequests.map((joinRequest, index) => {
                return (
                <StudentCard 
                  key={index}
                  classId={classId}
                  studentId={joinRequest.student}
                  is_accepted={joinRequest.is_accepted}
                  requestId={joinRequest.id}
                  fetchClass={fetchClass}
                />
              )})}
              {students.map((student, index) => (
                <StudentCard 
                  key={index}
                  classId={classId}
                  studentId={student}
                  is_accepted={true}
                />
              ))}
            </tbody>
          </table>
        ) : (
          <p>No students yet.</p>
        )}
      </div>
    </div>
  );
}

export default StudentsTab;
