import React from "react";
import "./App.css";
import Courselist from "./pages/Courselist";
import Searchbar from "./components/Searchbar";
import "./styles/testing.scss";
import Carousel from "./components/Carousel";
import Syllabus from "./components/Syllabus";
import CourseMain from "./components/CourseMain";
import CourseDetails from "./pages/CourseDetails";
import CourseList from "./pages/Courselist";
import MockTest from "./pages/Mocktest";
import MockTestResults from "./pages/MocktestResults";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Classes from "./pages/Classes";
import Classroom from "./pages/Classroom";
import Student from "./pages/Student";
import Teacher from "./pages/Teacher";
import LessonPage from "./pages/LessonPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" Component={CourseList} />
        <Route path="/course/:id" Component={CourseDetails} />
        <Route path="/course/:course_id/mocktest/:mocktest_id" Component={MockTest} />
        <Route path="/course/:course_id/mocktest/:mocktest_id/results" Component={MockTestResults} />
        <Route path="/classes" Component={Classes} />
        <Route path="/classes/:id" Component={Classroom} />
        <Route path="/student" Component={Student} />
        <Route path="/teacher" Component={Teacher} />
      </Routes>
    </Router>
  );
}

export default App;
