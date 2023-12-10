import { useState, useEffect } from 'react';
import '../styles/forumlike.scss';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { selectUser } from '../redux/slices/authSlice';
import ForumLikeCard from './ForumLikeCard';

interface ForumModalCommentProps {
  closeModal: () => void;
}

function ForumModalLike({ closeModal }: ForumModalCommentProps) {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const [comment, setComment] = useState('');
  const [count, setCount] = useState(0);
  const navigate = useNavigate();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
  };

  return (
    <div id="like-modal" className="like-modal">
      <div className="like-modal-content">
        <div className="like-modal-header">
          <h1 className="like-title">Likes - {count}</h1>
          <span className="close like-title" onClick={closeModal}>
            &times;
          </span>
        </div>
        <div className="like-cards">
          <ForumLikeCard />
          <ForumLikeCard />
          <ForumLikeCard />
          <ForumLikeCard />
          <ForumLikeCard />
          <ForumLikeCard />
          <ForumLikeCard />
          <ForumLikeCard />
          <ForumLikeCard />
        </div>
        <button type="submit" className="like-card-button">
          Like
        </button>
      </div>
    </div>
  );
}

export default ForumModalLike;
