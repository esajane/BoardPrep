import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import profileImage from '../assets/16.png'
import '../styles/classroom.scss'
import PostsTab from '../components/PostsTab'

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
  const [classItem, setClass] = useState<Class>()
  const [activeLink, setActiveLink] = useState('Posts');

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

  const renderTab = () => {
    switch (activeLink) {
      case 'Posts':
        return <PostsTab />;
      default:
        return <PostsTab />;
    }
  }

  return (
    <div className="class-background">
      <header>
        <div className='left-header'>
          <div className='left-header--title'>
            <h1>Classroom</h1>
            <h3>{classItem && classItem.className}</h3>
          </div>
          <nav className="class-nav">
              <ul>
                  <li className={activeLink === 'Posts' ? 'active' : ''} onClick={() => setActiveLink('Posts')}>Posts</li>
                  <li className={activeLink === 'Materials' ? 'active' : ''} onClick={() => setActiveLink('Materials')}>Materials</li>
                  <li className={activeLink === 'Activities' ? 'active' : ''} onClick={() => setActiveLink('Activities')}>Activities</li>
                  <li className={activeLink === 'Students' ? 'active' : ''} onClick={() => setActiveLink('Students')}>Students</li>
              </ul>
          </nav>
        </div>
        <div className="profile-pic2">
          <img src={profileImage} className="logo" alt="RILL" />
        </div>
      </header>
      <div className='class-content'>
        {renderTab()}
      </div>
    </div>
  )
}

export default Classroom