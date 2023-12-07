import { useState, useEffect } from 'react';
import '../styles/forumcomment.scss';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { selectUser } from '../redux/slices/authSlice';
import ForumCommentCard from './ForumCommentCard';

interface ForumModalCommentProps {
  closeModal: () => void;
}

function ForumModalComment({ closeModal }: ForumModalCommentProps) {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const [comment, setComment] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
  };

  return (
    <div id="comment-modal" className="comment-modal">
      <div className="comment-modal-content">
        <div className="comment-modal-header">
          <h1 className="comment-title">Comments</h1>
          <span className="close comment-title" onClick={closeModal}>
            &times;
          </span>
        </div>
        <div className="comment-cards">
          <ForumCommentCard />
          <ForumCommentCard />
          <ForumCommentCard />
          <ForumCommentCard />
        </div>
        <form onSubmit={handleSubmit}>
          <textarea
            placeholder="Add a comment..."
            name="comment"
            onChange={(e) => setComment(e.target.value)}
          />
          <button type="submit" className="card-button">
            Comment
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForumModalComment;
