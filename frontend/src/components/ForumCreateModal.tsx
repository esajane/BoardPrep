import { useState, useEffect, SetStateAction, Dispatch } from 'react';
import '../styles/class.scss';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { selectUser } from '../redux/slices/authSlice';
import axios from 'axios';

interface Posts {
  author: string;
  dateCreate: string;
  title: string;
  content: string;
  tags: string;
}

interface ForumCreateProps {
  closeModal: () => void;
  setPosts: (classes: Posts[]) => void;
}

function ForumCreate({ closeModal }: ForumCreateProps) {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://127.0.0.1:8000/create/post/', {
        post: user.token.id,
        author: user.token.id,
        title,
        content,
        tags,
      });
      console.log(res.data);
      closeModal();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div id="modal" className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h1 className="title">Create Post</h1>
          <span className="close title" onClick={closeModal}>
            &times;
          </span>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Title"
            name="title"
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="Content"
            name="content"
            onChange={(e) => setContent(e.target.value)}
          />
          <input
            type="text"
            placeholder="Tags"
            name="tags"
            onChange={(e) => setTags(e.target.value)}
          />
          <button type="submit" className="card-button">
            Create
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForumCreate;
