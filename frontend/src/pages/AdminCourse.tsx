import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CourseCard from "../components/CoursecardC";
import CourseModal from "../components/CourseModal";
import "../styles/admin.scss";
import Searchbar from "../components/SearchBar";
import { AxiosResponse } from "axios";
import DropDownProfile from "../components/DropDownProfile";
import profileImage from "../assets/16.png";

interface Course {
  course_id: string;
  course_title: string;
  short_description: string;
  image: string;
}

const AdminDashboard: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isCreateCourseModalOpen, setIsCreateCourseModalOpen] = useState(false);
  const navigate = useNavigate();
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [openProfile, setOpenProfile] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response: AxiosResponse = await axios.get(
        "http://127.0.0.1:8000/courses/"
      );
      setCourses(response.data);
      setFilteredCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
      // Handle error (show message or UI element)
    }
  };

  const handleCreateCourse = () => {
    setIsCreateCourseModalOpen(true);
  };

  const handleSelectCourse = (courseId: string) => {
    navigate(`/courses/${courseId}/edit`);
  };

  const handleCloseCreateCourseModal = () => {
    setIsCreateCourseModalOpen(false);
    fetchCourses();
  };

  const handleSearch = (query: string) => {
    if (!query) {
      setFilteredCourses(courses);
      return;
    }
    const lowerCaseQuery = query.toLowerCase();
    const filtered = courses.filter(
      (course) =>
        course.course_title.toLowerCase().includes(lowerCaseQuery) ||
        course.course_id.toLowerCase().includes(lowerCaseQuery)
    );
    setFilteredCourses(filtered);
  };
  return (
    <div className="admin-dashboard-background">
      <div className="admin-header">
        <div className="search">
          <Searchbar onSearch={handleSearch} />
        </div>
        <div className="profile-pic2">
          <img
            src={profileImage}
            className="logo"
            alt="RILL"
            onClick={() => setOpenProfile((prev) => !prev)}
          />
          {openProfile && <DropDownProfile />}
        </div>
      </div>

      <header className="admin-header">
        <h1>Course Management</h1>
        <button className="create-course-btn" onClick={handleCreateCourse}>
          Create Course
        </button>
      </header>
      <div className="course-list">
        {filteredCourses.map(
          (
            course // Use filteredCourses here
          ) => (
            <CourseCard
              key={course.course_id}
              id={course.course_id}
              course_title={course.course_title}
              short_description={course.short_description}
              image={course.image}
              onSelectCourse={handleSelectCourse}
            />
          )
        )}
      </div>

      {isCreateCourseModalOpen && (
        <CourseModal
          closeModal={handleCloseCreateCourseModal}
          course={null}
          onUpdateDashboard={fetchCourses}
        />
      )}
    </div>
  );
};
export default AdminDashboard;
