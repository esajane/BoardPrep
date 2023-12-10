import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import Syllabus from "../components/Syllabus";
import "../styles/ckeditor-content.scss";
import { useParams } from "react-router-dom";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import CustomEditor from "ckeditor5-custom-build/build/ckeditor";
import CourseModal from "../components/CourseModal";
import LessonsModal from "../components/LessonsModal";
import "../styles/details.scss";

interface Course {
  course_id: string;
  course_title: string;
  short_description: string;
  long_description: string;
  image: string;
}

interface Page {
  page_number: number;
  content: string;
  syllabus: string;
}

interface Lesson {
  lesson_id: string;
  lesson_title: string;
  order: number;
  syllabus: string;
}

interface MaterialsProps {
  courseId: string;
}

function CourseDetails() {
  const { courseId } = useParams<{ courseId: string }>();
  const [pages, setPages] = useState<Page[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentLesson, setCurrentLesson] = useState<string | null>(null);
  const [isSyllabusCollapsed, setIsSyllabusCollapsed] = useState(false);
  const [selectedPage, setSelectedPage] = useState(null);
  const pageCount = pages.length;
  const [editorContent, setEditorContent] = useState("");
  const [isNewPage, setIsNewPage] = useState(false);
  const [syllabusId, setSyllabusId] = useState("");
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [courseData, setCourseData] = useState<Course | null>(null);
  const [openModal, setOpenModal] = useState<string | null>(null);

  // ... rest of your existing code

  // Function to handle opening the course modal

  const onUpdateDashboard = async () => {
    fetchSyllabus();
  };

  useEffect(() => {
    const fetchSyllabusAndFirstLesson = async () => {
      try {
        const syllabusResponse = await axios.get(
          `http://127.0.0.1:8000/syllabi/${courseId}/`
        );
        const syllabusData = syllabusResponse.data[0];
        setLessons(syllabusData.lessons);
        const fetchedSyllabusId = syllabusData.syllabus_id;
        setSyllabusId(fetchedSyllabusId);

        if (syllabusData.lessons.length > 0) {
          const firstLessonId = syllabusData.lessons[0].lesson_id;
          setCurrentLesson(firstLessonId); // Set the current lesson to the first lesson
          await fetchPages(firstLessonId); // Fetch pages for the first lesson
        }
      } catch (error) {
        console.error("Error fetching syllabus:", error);
      }
    };

    if (courseId) {
      fetchSyllabusAndFirstLesson();
    }
  }, [courseId]);

  const fetchSyllabus = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/syllabi/${courseId}/`
      );
      const syllabusData = response.data[0];
      setLessons(syllabusData.lessons);
    } catch (error) {
      console.error("Error fetching syllabus:", error);
    }
  };

  useEffect(() => {
    if (courseId) {
      fetchSyllabus();
    }
  }, [courseId]);

  const handleCheckboxChange = () => {
    setIsSyllabusCollapsed(!isSyllabusCollapsed);
  };

  const fetchCourseData = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/courses/${courseId}`
      );
      setCourseData(response.data);
    } catch (error) {
      console.error("Error fetching course data:", error);
    }
  };

  const handleOpenCourseModal = () => {
    fetchCourseData();
    setOpenModal("course"); // Set open modal to 'course'
  };

  const handleOpenLessonModal = () => {
    setOpenModal("lesson"); // Set open modal to 'lesson'
  };

  // Function to close any open modal
  const handleCloseModal = () => {
    setOpenModal(null);
  };

  const fetchPages = async (lessonId: string) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/pages/${lessonId}/`
      );
      console.log("Pages data:", response.data);
      if (response.data.length === 0) {
        // No pages found for the lesson
        setPages([{ page_number: 1, content: "", syllabus: syllabusId }]); // Set a default empty page
        setCurrentPage(0);
        setEditorContent(""); // Set empty content for the editor
        setIsNewPage(true); // Indicate that this is a new page
      } else {
        // Pages found, set them in the state
        setPages(response.data);
        setCurrentPage(0);
        setEditorContent(response.data[0].content); // Set the content of the first page
        setIsNewPage(false);
      }
    } catch (error) {
      console.error("Error fetching pages:", error);
    }
  };

  const handleLessonClick = async (lessonId: string) => {
    try {
      // Fetch the lesson's pages based on the lessonId
      await fetchPages(lessonId);

      // Set the current lesson to the clicked lesson
      setCurrentLesson(lessonId);
    } catch (error) {
      console.error("Error handling lesson click:", error);
    }
  };

  const handlePageClick = async (event: { selected: number }) => {
    const newPageIndex = event.selected;
    setCurrentPage(newPageIndex);
    setIsNewPage(true); // Assume a new page initially

    // Check if currentLesson is not null before proceeding
    if (currentLesson) {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/pages/${currentLesson}/${newPageIndex + 1}/`
        );
        if (response.data) {
          setEditorContent(response.data.content);
          setIsNewPage(false); // Existing content found, not a new page
        }
      } catch (error: any) {}
    }
  };

  const handleEditorChange = (event: any, editor: any) => {
    const data = editor.getData();
    setEditorContent(data);
  };

  const saveEditorContent = async () => {
    if (!currentLesson || !syllabusId) {
      console.error("No current lesson or syllabus ID selected");
      return;
    }

    if (!editorContent.trim()) {
      alert("Content cannot be empty");
      return;
    }

    const isNew = pages.length === 0 || isNewPage;
    let pageId = isNew
      ? pages.length > 0
        ? Math.max(...pages.map((p) => p.page_number)) + 1
        : 1
      : currentPage + 1;

    const apiUrl = `http://127.0.0.1:8000/pages/${currentLesson}/${
      isNew ? "" : pageId + "/"
    }`;
    const method = isNew ? "post" : "put";

    try {
      const payload = {
        page_number: pageId,
        content: editorContent,
        syllabus: syllabusId,
        lesson: currentLesson,
      };

      const response = await axios[method](apiUrl, payload);

      if (response.status === 200 || response.status === 201) {
        const newPages = isNew
          ? [...pages, payload]
          : pages.map((p) =>
              p.page_number === pageId ? { ...p, content: editorContent } : p
            );
        setPages(newPages);
        setIsNewPage(false);
        setCurrentPage(newPages.length - 1); // Update current page to the last
      }
    } catch (error) {
      console.error("Error saving page content:", error);
    }
  };

  const handleNewPage = () => {
    setIsNewPage(true);
    setEditorContent("");
    setCurrentPage(pages.length); // Sets to the next new page index
  };

  const handleEditorReady = (editor: any) => {
    const toolbarContainer = document.querySelector(".toolbar-container");
    if (toolbarContainer) {
      toolbarContainer.appendChild(editor.ui.view.toolbar.element);
    } else {
      console.error("Toolbar container not found");
    }
  };

  const mediaEmbedConfig = {
    toolbar: ["mediaEmbed"],
  };

  const editorConfiguration = {
    toolbar: {
      items: [
        "heading",
        "|",
        "fontSize",
        "fontFamily",
        "|",
        "fontColor",
        "fontBackgroundColor",
        "|",
        "bold",
        "italic",
        "underline",
        "|",
        "alignment",
        "|",
        "numberedList",
        "bulletedList",
        "|",
        "link",
        "blockQuote",
        "imageUpload",
        "|",
        "insertTable",
        "mediaEmbed",
        "|",
        "sourceEditing",
        "htmlEmbed",
        "|", // Break starts here
        "pageBreak",
        "codeBlock",
        // Additional toolbar items...
      ],
    },
    language: "en",
    image: {
      toolbar: [
        "imageTextAlternative",
        "imageStyle:inline",
        "imageStyle:block",
        "imageStyle:side",
        "linkImage",
      ],
    },
    table: {
      contentToolbar: [
        "tableColumn",
        "tableRow",
        "mergeTableCells",
        "tableCellProperties",
        "tableProperties",
      ],
    },
    mediaEmbed: mediaEmbedConfig,
    simpleUpload: {
      uploadUrl: `http://localhost:8000/media/uploads/`,
      // ... other necessary configurations
    },
  };

  return (
    <div className="admin-dashboard-background">
      <header className="admin-header">
        <h1>Course Management</h1>
        <button className="create-course-btn" onClick={handleOpenCourseModal}>
          Course
        </button>
        <button className="create-course-btn" onClick={handleOpenLessonModal}>
          Lesson
        </button>
      </header>

      <div className={`course-page ${isSyllabusCollapsed ? "collapsed" : ""}`}>
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
          <div className="toolbar-container"></div>
          <div className="ck-content">
            <CKEditor
              editor={CustomEditor.Editor}
              config={editorConfiguration}
              onReady={handleEditorReady}
              data={editorContent}
              onChange={handleEditorChange}
            />
            <button className="btnDets" onClick={saveEditorContent}>
              Save Content
            </button>
            <button className="btnDets" onClick={handleNewPage}>
              Add New Page
            </button>
          </div>

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

        {/* Conditional rendering based on openModal state */}
        {openModal === "course" && (
          <CourseModal
            closeModal={handleCloseModal}
            course={courseData}
            onUpdateDashboard={onUpdateDashboard}
          />
        )}

        {openModal === "lesson" && (
          <LessonsModal
            closeModal={handleCloseModal}
            syllabusId={syllabusId}
            onUpdateDashboard={onUpdateDashboard}
          />
        )}
      </div>
    </div>
  );
}

export default CourseDetails;
