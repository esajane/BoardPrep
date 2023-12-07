import React from "react";
import "../styles/forumlike.scss";
import boardprep from "../assets/boardprep.png";

const ForumLikeCard = () => {
  return (
    <div className="like-forum-post">
      <div className="like-forum-post-image">
        <img className="like-forum-image" src={boardprep}></img>
      </div>
      <div className="like-forum-post-details">
        <div className="like-forum-author-and-date">
          <span className="like-forum-post-author">Joe Ed Secoya</span>
          <span className="like-forum-post-like">Like this post</span>
          <span className="like-forum-post-date">11/30/2023, 12:31 PM</span>
        </div>
      </div>
    </div>
  );
}

export default ForumLikeCard;