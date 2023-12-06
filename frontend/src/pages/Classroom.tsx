import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import profileImage from "../assets/16.png";
import "../styles/classroom.scss";
import PostsTab from "../components/PostsTab";
import StudentsTab from "../components/StudentsTab";
import Materials from "../components/Materials";
import ActivitiesTab from "../components/ActivitiesTab";

interface Class {
  classId: number;
  className: string;
  classDescription: string;
  course: string;
  students: string[];
  classCode: string;
  teacher: string;
}

interface JoinRequest {
  id: number;
  is_accepted: boolean;
  class_instance: number;
  student: string;
}

function Classroom() {
  const { id: classId } = useParams();
  const [classItem, setClass] = useState<Class>();
  const [activeLink, setActiveLink] = useState("Posts");
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([]);

  const fetchClass = async () => {
    try {
      let response = await axios.get(
        `http://127.0.0.1:8000/classes/${classId}/`
      );
      setClass(response.data);
      response = await axios.get(
        `http://127.0.0.1:8000/join-requests/?class_id=${classId}`
      );
      setJoinRequests(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchClass = async () => {
      try {
        let response = await axios.get(
          `http://127.0.0.1:8000/classes/${classId}/`
        );
        setClass(response.data);
        response = await axios.get(
          `http://127.0.0.1:8000/join-requests/?class_id=${classId}`
        );
        setJoinRequests(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchClass();
  }, [classId]);

  const renderTab = () => {
    if (!classItem) return null;
    switch (activeLink) {
      case "Posts":
        return <PostsTab classId={classItem.classId} />;
      case "Students":
        return (
          <StudentsTab
            classId={classItem.classId}
            joinRequests={joinRequests}
            students={classItem.students}
            teacher={classItem.teacher}
            fetchClass={fetchClass}
          />
        );
      case "Materials":
        return <Materials courseId={classItem.course} />;
      case "Activities":
        return <ActivitiesTab classId={classItem.classId} />;
      default:
        return <PostsTab classId={classItem.classId} />;
    }
  };

  return (
    <div className="class-background">
      <div className="header-classroom">
        <div className="left-header">
          <div className="left-header--title">
            <h1>Classroom</h1>
            <h3>{classItem && classItem.className}</h3>
          </div>
          <nav className="class-nav">
            <ul className="room-ul">
              <li
                className={activeLink === "Posts" ? "active" : ""}
                onClick={() => setActiveLink("Posts")}
              >
                Posts
              </li>
              <li
                className={activeLink === "Materials" ? "active" : ""}
                onClick={() => setActiveLink("Materials")}
              >
                Materials
              </li>
              <li
                className={activeLink === "Activities" ? "active" : ""}
                onClick={() => setActiveLink("Activities")}
              >
                Activities
              </li>
              <li
                className={activeLink === "Students" ? "active" : ""}
                onClick={() => setActiveLink("Students")}
              >
                Students
              </li>
            </ul>
          </nav>
        </div>
        <div className="profile-pic2">
          <img src={profileImage} className="logo" alt="RILL" />
        </div>
      </div>
      <div className="class-content">{renderTab()}</div>
    </div>
  );
}

export default Classroom;
