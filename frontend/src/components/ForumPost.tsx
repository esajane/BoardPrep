import React, { useState, useEffect } from 'react';
import '../styles/forum.scss';
import boardprep from '../assets/boardprep.png';
import ForumModalComment from './ForumModalComment';
import ForumModalLike from './ForumModalLike';

const ForumPost = () => {
  const [modalOpenComment, setModalOpenComment] = useState(false);
  const [modalOpenLike, setModalOpenLike] = useState(false);

  const openModalComment = () => {
    setModalOpenComment(true);
    console.log('Open Comment');
  };

  const closeModalComment = () => {
    setModalOpenComment(false);
    console.log('Close Comment');
  };

  const openModalLike = () => {
    // Logic for opening Signup modal
    setModalOpenLike(true);
    console.log('Open Signup');
  };

  const closeModalLike = () => {
    // Logic for opening Signup modal
    setModalOpenLike(false);
    console.log('Close Signup');
  };

  return (
    <div className="forum-post">
      <div className="forum-post-image">
        <img className="forum-image" src={boardprep}></img>
      </div>
      <div className="forum-post-details">
        <div className="forum-author-and-date">
          <span className="forum-post-author">Author: Joe Ed Secoya</span>
          <span className="forum-post-date">11/30/2023, 12:31 PM</span>
        </div>
        <span className="forum-post-title">How To Hack Using HTML</span>
        <div className="forum-post-content">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </div>
        <div className="forum-post-tags-buttons">
          <div>
            <span className="forum-post-tags">HAcker</span>
            <span className="forum-post-tags">HAcker</span>
            <span className="forum-post-tags">HAcker</span>
          </div>
          <div className="forum-buttons">
            <button className="forum-button" onClick={openModalComment}>
              Comment
            </button>
            <button className="forum-button" onClick={openModalLike}>
              Like
            </button>
            {modalOpenComment && (
              <ForumModalComment closeModal={closeModalComment} />
            )}
            {modalOpenLike && (
              <ForumModalLike closeModal={closeModalLike}/>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForumPost;
