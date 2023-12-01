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
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LessonPage from "./pages/LessonPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" Component={CourseList} />
        <Route path="/course/:id" Component={CourseDetails} />
      </Routes>
    </Router>
  );
}

export default App;
