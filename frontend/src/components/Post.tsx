import React, { useEffect, useRef, useState } from 'react'
import '../styles/post.scss'
import { FaReply, FaEllipsisV } from "react-icons/fa";
import { IoChevronForwardOutline, IoChevronDownOutline } from "react-icons/io5";
import profileImage from '../assets/16.png'
import axios from 'axios';
import { convertToPHTime } from '../functions';
import Reply from './Reply';

interface PostProps {
  content: string,
  createdAt: string,
  postId: number,
  setPosts: React.Dispatch<React.SetStateAction<any[]>>,
  teacher_id: string,
}

interface Posts {
  id: number,
  content: string,
  created_at: string,
  class_instance: number,
  teacher_id: string,
}

interface Comment {
  id: number,
  content: string,
  created_at: string,
  post: number,
  user: string,
}

function Post({ content, createdAt, postId, setPosts, teacher_id }: PostProps) {
  const [showMenu, setShowMenu] = useState(false);
  const replyRef = useRef<HTMLInputElement>(null)
  const [comments, setComments] = useState<Comment[]>([]);
  const [showReplies, setShowReplies] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/comments/?post_id=${postId}`);
        setComments(response.data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchComments();
  }, [postId])

  const toggleMenu = () => setShowMenu(!showMenu);

  const deletePost = async () => {
    try {
      await axios.delete(`http://localhost:8000/posts/${postId}/`)
      setPosts((posts: Posts[]) => posts.filter((post) => post.id !== postId));
    } catch (err) {
      console.error(err);
    }
  }

  const handleDeletePost = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    deletePost();
  }
  
  const handleReply = async () => {
    try {
      const reply = replyRef.current?.value;
      if(reply) {
        const response = await axios.post(`http://127.0.0.1:8000/comments/`, {
          content: reply,
          post: postId,
          user: 'student1' // TODO: replace with actual student
        })
        setComments([...comments, response.data]);
        replyRef.current!.value = '';
      }
    } catch (err) {
      console.error(err);
    }
  }

  const handleReplyClick = (e: React.MouseEvent<SVGElement>) => {
    e.preventDefault();
    handleReply();
  }

  const handleShowReplies = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setShowReplies(!showReplies);
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Enter') {
      handleReply();
    }
  };

  const curr_user = 'teacher1';

  return (
    <div className='post-card'>
      <div className="post-card--read">
        <div className="post-card--read--header">
          <div className="post-card--read--header--left">
            <div className="post-card--read--header--left--pic">
              <img src={profileImage} className="logo" alt="RILL" />
            </div>
            <div className="post-card--read--header--left--name">
              Kobe Paras
            </div>
            <div className="post-card--read--header--left--time">
              {convertToPHTime(createdAt)}
            </div>
          </div>
          {teacher_id === curr_user && <div className="post-card--read--header--menu" onClick={toggleMenu}>
            <FaEllipsisV />
            {showMenu && (
              <div className="menu-dropdown">
                <ul>
                  <li onClick={handleDeletePost}>Delete</li>
                </ul>
              </div>
            )}
          </div>}
        </div>
        <div className="post-card--read--body">
          {content}
        </div>
        <div className="post-card--read--replies">
            {comments.length > 0 && 
            <div className='post-card--read--replies__view' onClick={handleShowReplies}>View replies {showReplies ? <IoChevronDownOutline /> : <IoChevronForwardOutline />}</div>}
            {showReplies && comments.map((comment) => (
              <Reply key={comment.id} comment={comment} setComments={setComments} />
            ))}
        </div>
      </div>
      <div className="post-card--reply">
        <FaReply onClick={handleReplyClick} /> 
        <input type='text' className='post-card--reply--input' placeholder="Reply" ref={replyRef} onKeyUp={handleKeyDown} />
      </div>
    </div>
  )
}

export default Post