import React from 'react'
import '../styles/post.scss'
import { FaReply } from "react-icons/fa";
import profileImage from '../assets/16.png'

interface PostProps {
  content: string,
  createdAt: string,
}

function Post({ content, createdAt }: PostProps) {
  const convertToPHTime = (timestamp: string) => {
    const utcDate = new Date(timestamp);
    const phTime = new Date(utcDate.getTime());
    const formattedDate = phTime.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit'
    });
    const formattedTime = phTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });

    return `${formattedDate} ${formattedTime}`;
}

  return (
    <div className='post-card'>
      <div className="post-card--read">
        <div className="post-card--read--header">
          <div className="post-card--read--header--pic">
            <img src={profileImage} className="logo" alt="RILL" />
          </div>
          <div className="post-card--read--header--name">
            Kobe Paras
          </div>
          <div className="post-card--read--header--time">
            {convertToPHTime(createdAt)}
          </div>
        </div>
        <div className="post-card--read--body">
          {content}
        </div>
      </div>
      <div className="post-card--reply">
        <FaReply /> <div className='post-card--reply--text'>Reply</div>
      </div>
    </div>
  )
}

export default Post