import React from "react";
import "../styles/forumcomment.scss";
import boardprep from "../assets/boardprep.png";

const ForumCommentCard = () => {
  return (
    <div className="comment-forum-post">
      <div className="comment-forum-post-image">
        <img className="comment-forum-image" src={boardprep}></img>
      </div>
      <div className="comment-forum-post-details">
        <div className="comment-forum-author-and-date">
          <span className="comment-forum-post-author">Author: Joe Ed Secoya</span>
          <span className="comment-forum-post-date">11/30/2023, 12:31 PM</span>
        </div>
        <div className="comment-forum-post-content">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </div>
      </div>
    </div>
  );
}

export default ForumCommentCard;