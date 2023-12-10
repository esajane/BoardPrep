import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import Lessons from "./Lessons";

interface Page {
  page_number: number;
  content: string;
}

interface MaterialsProps {
  lessonId: string;
}

const Materials: React.FC<MaterialsProps> = ({ lessonId }) => {
  const [pages, setPages] = useState<Page[]>([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/pages/${lessonId}/`)
      .then((response) => {
        setPages(response.data);
        setCurrentPageIndex(0); // Reset to the first page when the lesson changes
      })
      .catch((error) => console.error("Error fetching pages:", error));
  }, [lessonId]);

  const handlePageClick = (event: { selected: number }) => {
    setCurrentPageIndex(event.selected);
  };

  return (
    <div className="materials-container">
      {pages.length > 0 && (
        <Lessons content={pages[currentPageIndex].content} />
      )}

      {pages.length > 1 && (
        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          breakLabel={"..."}
          pageCount={pages.length}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
          containerClassName={"pagination"}
          activeClassName={"active"}
          forcePage={currentPageIndex} // Ensures the correct page is highlighted in pagination
        />
      )}
    </div>
  );
};

export default Materials;
