import React, { useEffect, useState } from "react";
import axios from "axios";
import ClassModal from "../components/ClassModal";
import profileImage from "../assets/16.png";
import ClassCard from "../components/ClassCard";
import DropDownProfile from "../components/DropDownProfile";
import "../styles/class.scss";
import { useAppSelector } from "../redux/hooks";
import { selectUser } from "../redux/slices/authSlice";

interface Class {
  classId: number;
  className: string;
  classDescription: string;
  teacher_name: string;
  course: string;
  image: string;
  students: string[];
  classCode: string;
}

function Classes() {
  const user = useAppSelector(selectUser);
  const [classes, setClasses] = useState<Class[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/classes/?${
          user.token.type === "T" ? "teacher_id" : "student_id"
        }=${user.token.id}`
      );
      setClasses(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div className="class-background">
      <header>
        <h1>MY CLASSES</h1>
        <div className="profile-pic2">
          <img
            src={profileImage}
            className="logo"
            alt="RILL"
            onClick={() => setOpenProfile((prev) => !prev)}
          />
          {openProfile && <DropDownProfile />}
        </div>
      </header>
      <div className="class-container">
        {classes.map((classItem, index) => (
          <ClassCard key={index} class={classItem} />
        ))}
        <button className="create-classbtn" onClick={openModal}>
          Create Class +
        </button>
        {modalOpen && (
          <ClassModal
            closeModal={closeModal}
            classes={classes}
            setClasses={setClasses}
          />
        )}
      </div>
    </div>
  );
}

export default Classes;
