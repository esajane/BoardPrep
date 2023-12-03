import React, { useState } from "react";
import profileImage from "../assets/16.png";
import "../styles/reply.scss";
import { convertToPHTime } from "../functions";
import { FaEllipsisV } from "react-icons/fa";
import axios from "axios";

interface Comment {
  id: number;
  content: string;
  created_at: string;
  post: number;
  user: string;
}

interface ReplyProps {
  comment: Comment;
  setComments: React.Dispatch<React.SetStateAction<any[]>>;
}

function Reply({ comment, setComments }: ReplyProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [hovered, setHovered] = useState(false);
  const curr_user = "student1";

  const toggleMenu = () => setShowMenu(!showMenu);

  const deleteComment = async () => {
    try {
      await axios.delete(`http://localhost:8000/comments/${comment.id}/`);
      setComments((prevComments: Comment[]) =>
        prevComments.filter((currComment) => currComment.id !== comment.id)
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteComment = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    deleteComment();
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setHovered(true);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setHovered(false);
  };

  return (
    <div
      className="reply"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="reply--header">
        <div className="reply--header__left">
          <div className="reply--header__left--pic">
            <img src={profileImage} className="logo" alt="RILL" />
          </div>
          <div className="reply--header__left--name">{comment.user}</div>
          <div className="reply--header__left--time">
            {convertToPHTime(comment.created_at)}
          </div>
        </div>
        {comment.user === curr_user && hovered && (
          <div className="reply--header__menu" onClick={toggleMenu}>
            <FaEllipsisV />
            {showMenu && (
              <div className="menu-dropdown">
                <ul>
                  <li onClick={handleDeleteComment}>Delete</li>
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="reply--body">{comment.content}</div>
    </div>
  );
}

export default Reply;
