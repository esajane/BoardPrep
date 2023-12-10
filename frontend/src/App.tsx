import React, { useEffect } from "react";
import "./App.css";
import Courselist from "./pages/Courselist";

import "./styles/testing.scss";
import Syllabus from "./components/Syllabus";
import MockTest from "./pages/Mocktest";
import CourseDetails from "./pages/CourseDetails";

import AdminDashboard from "./pages/AdminCourse";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Classes from "./pages/Classes";
import Classroom from "./pages/Classroom";
import Student from "./pages/Student";
import Teacher from "./pages/Teacher";
import LessonPage from "./pages/LessonPage";
import Home from "./pages/Home";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import { setUserFromLocalStorage } from "./redux/slices/authSlice";
import { useAppDispatch } from "./redux/hooks";
import { Provider } from "react-redux";
import store from "./redux/store";
//import MockTestManage from "./pages/MockTestManage";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setUserFromLocalStorage());
  }, [dispatch]);
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        {/* <Route
          path="/course/:id"
          element={
            <PrivateRoute>
              <CourseDetails />
            </PrivateRoute>
          }
        /> */}
        <Route
          path="/mocktest/"
          element={
            <PrivateRoute>
              <MockTest />
            </PrivateRoute>
          }
        />
        <Route
          path="/classes"
          element={
            <PrivateRoute>
              <Classes />
            </PrivateRoute>
          }
        />
        <Route
          path="/classes/:id"
          element={
            <PrivateRoute>
              <Classroom />
            </PrivateRoute>
          }
        />
        <Route
          path="/student"
          element={
            <PublicRoute>
              <Student />
            </PublicRoute>
          }
        />
        <Route
          path="/teacher"
          element={
            <PublicRoute>
              <Teacher />
            </PublicRoute>
          }
        />
        <Route
          path="/home"
          element={
            <PublicRoute>
              <Home />
            </PublicRoute>
          }
        />
        <Route
          path="/content"
          element={
            <PrivateRoute>
              <Provider store={store}>
                <AdminDashboard />
              </Provider>
            </PrivateRoute>
          }
        />
        <Route
          path="/courses/:courseId/edit"
          element={
            <PrivateRoute>
              <Provider store={store}>
                <CourseDetails />
              </Provider>
            </PrivateRoute>
          }
        />
        {/* <Route
          path="/mocktest/:mocktestID/manage"
          element={
            <PublicRoute>
              <Provider store={store}>
                <MockTestManage />
              </Provider>
            </PublicRoute>
          }
        />
      </Routes> */}
      </Routes>
    </Router>
  );
}

export default App;
