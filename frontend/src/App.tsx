import React from "react";
import "./App.css";
import Courselist from "./pages/Courselist";
import "./styles/testing.scss";
import Syllabus from "./components/Syllabus";
import MockTest from "./pages/Mocktest";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Classes from "./pages/Classes";
import Classroom from "./pages/Classroom";
import Student from "./pages/Student";
import Teacher from "./pages/Teacher";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" Component={Classes} />
        <Route path="/mocktest/" Component={MockTest} />
        <Route path="/classes" Component={Classes} />
        <Route path="/classes/:id" Component={Classroom} />
        <Route path="/student" Component={Student} />
        <Route path="/teacher" Component={Teacher} />
      </Routes>
    </Router>
  );
}

export default App;
