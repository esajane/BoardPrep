import React, { useState } from 'react';
import ForumPost from '../components/ForumPost';
import '../styles/forum.scss'
import ForumCreateModal from '../components/ForumCreateModal';
import { useAppSelector } from "../redux/hooks";
// import { selectUser } from "../redux/slices/authSlice";
import axios from 'axios';

const Forum = () => {
  // const user = useAppSelector(selectUser);
  const [post, setPosts] = useState([]);
  const [createPost, setCreatePost] = useState(false);



  // const fetchPosts = async () => {
  //   try {
  //     const response = await axios.get(
  //       `http://127.0.0.1:8000/classes/`
  //     );
  //     setPosts(response.data);
  //   }
  //   catch (err) {
  //     console.error(err);
  //   }
  // }

  const openCreatePost = () => {
    setCreatePost(true);
    console.log('Open Create Post');
  };

  const closeCreatePost = () => {
    setCreatePost(false);
    console.log('Close Create Post');
  };

  return (
    <div className="background">
      <header>
        <div className='form-pili'>
          <button className="form-pili-item">New</button>
          <button className="form-pili-item">Top</button>
          <button className="form-pili-item">Hot</button>
        </div>
        <div>
          <button className="user-c" onClick={openCreatePost}>Create Post</button>
        </div>
        {createPost && (
            <ForumCreateModal closeModal={closeCreatePost} />
          )}
      </header>
      <div>
        <ForumPost />
      </div>
    </div>
  );
};

export default Forum;
