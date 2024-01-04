import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import "../styles/details.scss";
import Syllabus from "../components/Syllabus";
import "../styles/ckeditor-content.scss";
import { useParams } from "react-router-dom";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import CustomEditor from "ckeditor5-custom-build/build/ckeditor";
import CourseModal from "../components/CourseModal";
import LessonsModal from "../components/LessonsModal";
import PublishModal from "../components/PublishModal";

interface Course {
  course_id: string;
  course_title: string;
  short_description: string;
  long_description: string;
  image: string;
  is_published: boolean;
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
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [lessonsLoaded, setLessonsLoaded] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const isCoursePublished = courseData?.is_published;
  const paginationKey = pages.length;
  const [loading, setLoading] = useState(true);
  const defaultPageState: Page = {
    page_number: 1,
    content: "", // Assuming the default content should be empty
    syllabus: syllabusId, // You already have syllabusId in your state
  };
  const onUpdateDashboard = async () => {
    fetchSyllabus();
  };

  useEffect(() => {
    console.log("Lessons length:", lessons.length);
    if (lessons.length === 0 && lessonsLoaded) {
      handleOpenLessonModal();
    }
  }, [lessons, lessonsLoaded]);

  useEffect(() => {
    const fetchSyllabusAndFirstLesson = async () => {
      try {
        const syllabusResponse = await axios.get(
          `http://127.0.0.1:8000/syllabi/${courseId}/`
        );
        const syllabusData = syllabusResponse.data[0];
        setLessons(syllabusData.lessons);
        setLessonsLoaded(true);
        const fetchedSyllabusId = syllabusData.syllabus_id;
        setSyllabusId(fetchedSyllabusId);

        if (syllabusData.lessons.length === 0) {
          handleOpenLessonModal(); // Open LessonModal if no lessons
        }

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
    setLessonsLoaded(false); // Reset when courseId changes
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

  useEffect(() => {
    fetchCourseData();
  }, [courseId]);

  const fetchCourseData = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/courses/${courseId}/`
      );
      setCourseData(response.data);
    } catch (error) {
      console.error("Error fetching course data:", error);
    }
  };

  const handleConfirmPublish = async () => {
    try {
      await axios.put(`http://127.0.0.1:8000/courses/${courseId}/publish/`, {
        isPublished: true,
      });
      console.log("Course published successfully");
      fetchCourseData(); // Refetch course data after publishing
    } catch (error) {
      console.error("Error in publishing course:", error);
    }
  };

  const handleOpenCourseModal = () => {
    fetchCourseData();
    setOpenModal("course");
  };

  const handleOpenLessonModal = () => {
    if (lessons.length === 0) {
      // Optionally, handle the case when there are no lessons
      console.warn("No lessons available for updating");
      setOpenModal("lesson");
      return;
    }
    const currentLessonDetails = lessons.find(
      (l) => l.lesson_id === currentLesson
    );
    if (currentLessonDetails) {
      setSelectedLesson(currentLessonDetails);
    }
    setOpenModal("lesson");
  };

  const handleCloseModal = () => {
    setOpenModal(null);
  };

  const fetchPages = async (lessonId: string) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/pages/${lessonId}/`
      );
      console.log("Fetched pages data:", response.data); // Log the fetched data
      setPages(response.data);
      console.log("Updated pages state:", response.data.length); // Log the updated stat
      if (response.data.length === 0) {
        setIsNewPage(true);
      } else {
        setIsNewPage(false);
      }
    } catch (error) {
      console.error("Error fetching pages:", error);
    }
  };

  const handleLessonClick = async (lessonId: string) => {
    try {
      await fetchPages(lessonId);
      setCurrentLesson(lessonId);
    } catch (error) {
      console.error("Error handling lesson click:", error);
    }
  };

  const handlePageClick = async (event: { selected: number }) => {
    const newPageIndex = event.selected;
    console.log("Page clicked, selected index:", newPageIndex);
    setCurrentPage(newPageIndex);
    setIsNewPage(true);
    if (currentLesson) {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/pages/${currentLesson}/${newPageIndex + 1}/`
        );
        if (response.data) {
          setEditorContent(response.data.content);
          setIsNewPage(false);
        }
      } catch (error: any) {}
    }
  };

  const handleOpenPublishModal = () => {
    setShowPublishModal(true);
  };

  const handleClosePublishModal = () => {
    setShowPublishModal(false);
  };

  const handleEditorChange = (event: any, editor: any) => {
    const data = editor.getData();
    setEditorContent(data);
    console.log("Editor content (should be HTML):", data);
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

    let pageId: number;
    if (isNewPage) {
      if (
        pages.length === 0 ||
        (pages.length === 1 && pages[0].content === "")
      ) {
        pageId = 1;
      } else {
        pageId = Math.max(...pages.map((p) => p.page_number)) + 1;
      }
    } else {
      pageId = currentPage + 1;
    }

    const apiUrl = `http://127.0.0.1:8000/pages/${currentLesson}/${
      isNewPage ? "" : pageId + "/"
    }`;
    const method = isNewPage ? "post" : "put";

    try {
      const payload = {
        page_number: pageId,
        content: editorContent,
        syllabus: syllabusId,
        lesson: currentLesson,
      };

      const response = await axios[method](apiUrl, payload);

      if (response.status === 200 || response.status === 201) {
        const newPages = isNewPage
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
    console.log("isNewPage:", isNewPage); // Log the value of isNewPage
    console.log("Pages length:", pages.length); // Log the length of pages
    console.log("Current page:", currentPage); // Log the current page index
    console.log("Computed pageId:", pageId); // Log the computed pageId
  };

  const handleNewPage = () => {
    setIsNewPage(true);
    console.log("Creating a new page, pages length:", pages.length);
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
        "|",
        "pageBreak",
        "codeBlock",
      ],
    },
    language: "en",
    image: {
      toolbar: [
        "imageTextAlternative",
        "imageStyle:inline",
        "imageStyle:block",
        "imageStyle:alignLeft",
        "imageStyle:alignRight",
        "imageStyle:alignBlockLeft",
        "imageStyle:alignBlockRight",
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
    },
    removePlugins: ["Markdown"],
  };

  console.log("PageCount:", pageCount);

  return (
    <div className="dashboard-background">
      <header className="top-header">
        <h1>Course Management</h1>
        <button className="create-btn" onClick={handleOpenCourseModal}>
          Course
        </button>
        <button className="create-btn" onClick={handleOpenLessonModal}>
          Lesson
        </button>
        <button
          className={`create-btn ${
            courseData?.is_published ? "published" : ""
          }`}
          onClick={
            !courseData?.is_published ? handleOpenPublishModal : undefined
          }
          disabled={courseData?.is_published}
        >
          {courseData?.is_published ? "Published" : "Publish Course"}
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
            initialLessonId={selectedLesson?.lesson_id}
            initialLessonTitle={selectedLesson?.lesson_title}
          />
        )}
        {showPublishModal && courseData && (
          <PublishModal
            closeModal={handleClosePublishModal}
            onConfirmPublish={handleConfirmPublish}
            courseData={courseData} // courseData is guaranteed not to be null here
          />
        )}
      </div>
    </div>
  );
}

export default CourseDetails;
