import React from "react";
import DOMPurify from "dompurify";
import { marked } from "marked";
import "../styles/lessons.scss";
import "../styles/ckeditor-content.scss";

interface LessonContentProps {
  content: string;
}

const LessonContent: React.FC<LessonContentProps> = ({ content }) => {
  // Convert Markdown to HTML
  const markdownToHtml = (markdownContent: string): string => {
    return marked(markdownContent) as string; // Type assertion
  };

  // Sanitize the HTML content
  const sanitizedHTML = DOMPurify.sanitize(markdownToHtml(content));

  return (
    <div
      className="ck-content"
      dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
    />
  );
};

export default LessonContent;
