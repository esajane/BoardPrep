import React from "react";
import DOMPurify from "dompurify"; // Import the DOMPurify library
import "../styles/lessons.scss";
import "../styles/ckeditor-content.scss";

interface LessonContentProps {
  content: string;
}

const LessonContent: React.FC<LessonContentProps> = ({ content }) => {
  // Sanitize the HTML content before rendering it
  const sanitizedHTML = DOMPurify.sanitize(content);

  return (
    <div
      className="ck-content"
      dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
    />
  );
};

export default LessonContent;
