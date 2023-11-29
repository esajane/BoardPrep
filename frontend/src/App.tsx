import React from "react";
import "./App.css";
import Courselist from "./pages/Courselist";
import Searchbar from "./components/Searchbar";
import "./styles/testing.css";
import Carousel from "./components/Carousel";
import Syllabus from "./components/Syllabus";
import CourseMain from "./components/CourseMain";
import CourseDetails from "./pages/CourseDetails";
import CourseList from "./pages/Courselist";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Classes from "./pages/Classes";
import Classroom from "./pages/Classroom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" Component={CourseList} />
        <Route path="/course/:id" Component={CourseDetails} />
        <Route path="/classes" Component={Classes} />
        <Route path="/classes/:id" Component={Classroom} />
      </Routes>
    </Router>
  );
}

export default App;
