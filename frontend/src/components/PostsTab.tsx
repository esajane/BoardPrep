import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Post from './Post'
import '../styles/poststab.scss'
import { MdOutlinePostAdd, MdSend } from "react-icons/md";

interface Post {
  id: number,
  content: string,
  created_at: string,
  class_instance: number,
}

function PostsTab() {
  const [addingPost, setAddingPost] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetchPosts();
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/posts/");
      setPosts(response.data);
    } catch (err) {
      console.error(err);
    }
  }

  const handleAddPostClick = () => {
    setAddingPost(true);
  };

  const handleSendPost = async () => {
    try {
      if(newPostContent !== "") {
        const response = await axios.post(`http://127.0.0.1:8000/posts/`, {
          content: newPostContent,
          class_instance: 1, // TODO: replace with actual class
          teacher: 'teacher1' // TODO: replace with actual teacher
        });
        setPosts([...posts, response.data]);
      }
    } catch (err) {
      console.error(err);
    }
    setAddingPost(false);
    setNewPostContent("");
  };

  return (
    <div className='posts-tab'>
      <div className="posts-tab--center">
        {posts.map((post) => (
          <Post
            key={post.id}
            content={post.content}
            createdAt={post.created_at}
          />
        ))}
      </div>
      {addingPost ? (
        <div className="input-container">
          <textarea
            className="post-input"
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            placeholder="Type your post..."
          />
          <button className="send-post" onClick={handleSendPost}>
            <MdSend /> Post
          </button>
        </div>
      ) : (
        <button className={addingPost ? "add-post" : "add-post animate-button"} onClick={handleAddPostClick}>
          <MdOutlinePostAdd /> Add Post
        </button>
      )}
    </div>
  )
}

export default PostsTab