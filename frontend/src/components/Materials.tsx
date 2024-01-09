import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import Syllabus from "./Syllabus";
import LessonContent from "./Lessons";
import "../styles/materials.scss";
import axiosInstance from "../axiosInstance";

interface Page {
  page_number: number;
  content: string;
}

interface Lesson {
  lesson_id: string;
  lesson_title: string;
  order: number;
  content: string;
  syllabus: string;
}

interface MaterialsProps {
  courseId: string;
}

function Materials({ courseId }: MaterialsProps) {
  const [pages, setPages] = useState<Page[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentLesson, setCurrentLesson] = useState<string | null>(null);
  const [isSyllabusCollapsed, setIsSyllabusCollapsed] = useState(false);
  const pageCount = pages.length;

  useEffect(() => {
    const fetchSyllabusAndFirstLesson = async () => {
      try {
        const syllabusResponse = await axiosInstance.get(
          `/syllabi/${courseId}/`
        );
        const syllabusData = syllabusResponse.data[0];
        setLessons(syllabusData.lessons);

        if (syllabusData.lessons.length > 0) {
          const firstLessonId = syllabusData.lessons[0].lesson_id;
          setCurrentLesson(firstLessonId);
          await fetchPages(firstLessonId);
        }
      } catch (error) {
        console.error("Error fetching syllabus:", error);
      }
    };

    if (courseId) {
      fetchSyllabusAndFirstLesson();
    }
  }, [courseId]);

  useEffect(() => {
    const fetchSyllabus = async () => {
      try {
        const response = await axiosInstance.get(`/syllabi/${courseId}/`);
        const syllabusData = response.data[0];
        setLessons(syllabusData.lessons);
      } catch (error) {
        console.error("Error fetching syllabus:", error);
      }
    };

    if (courseId) {
      fetchSyllabus();
    }
  }, [courseId]);

  const handleCheckboxChange = () => {
    setIsSyllabusCollapsed(!isSyllabusCollapsed);
  };

  const fetchPages = async (lessonId: string) => {
    try {
      const response = await axiosInstance.get(`/pages/${lessonId}/`);
      setPages(response.data);
      setCurrentPage(0);
    } catch (error) {
      console.error("Error fetching pages:", error);
    }
  };

  const handleLessonClick = (lessonId: string) => {
    fetchPages(lessonId);
    setCurrentLesson(lessonId);
  };

  const handlePageClick = (event: { selected: number }) => {
    setCurrentPage(event.selected);
  };

  return (
    <div className={`materials-page ${isSyllabusCollapsed ? "collapsed" : ""}`}>
      <input
        type="checkbox"
        id="checkbox"
        className="checkbox"
        checked={isSyllabusCollapsed}
        onChange={handleCheckboxChange}
      />
      <label htmlFor="checkbox" className="toggle">
        <div className="bars" id="bar1"></div>
        <div className="bars" id="bar2"></div>
        <div className="bars" id="bar3"></div>
      </label>

      <div
        className={`syllabus-main ${isSyllabusCollapsed ? "collapsed" : ""}`}
      >
        <Syllabus lessons={lessons} onLessonClick={handleLessonClick} />
      </div>

      <div className="lesson-content-container">
        {pages.length > 0 && (
          <LessonContent content={pages[currentPage].content} />
        )}

        {pageCount > 1 && (
          <ReactPaginate
            previousLabel={currentPage > 0 ? "previous" : ""}
            nextLabel={currentPage < pageCount - 1 ? "next" : ""}
            breakLabel={"..."}
            pageCount={pageCount}
            onPageChange={handlePageClick}
            containerClassName={"pagination"}
            activeClassName={"active"}
          />
        )}
      </div>
    </div>
  );
}

export default Materials;
