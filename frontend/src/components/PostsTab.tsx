import React, { useEffect, useState } from "react";
import axios from "axios";
import Post from "./Post";
import "../styles/poststab.scss";
import { MdOutlinePostAdd, MdSend } from "react-icons/md";

interface Posts {
  id: number;
  content: string;
  created_at: string;
  class_instance: number;
  teacher: string;
  teacher_name: string;
}

interface PostProps {
  classId: number;
}

function PostsTab({ classId }: PostProps) {
  const [addingPost, setAddingPost] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");
  const [posts, setPosts] = useState<Posts[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/posts/?class_id=${classId}`
        );
        setPosts(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPosts();
  }, [classId]);

  const handleAddPostClick = () => {
    setAddingPost(true);
  };

  const handleSendPost = async () => {
    try {
      if (newPostContent !== "") {
        const response = await axios.post(`http://127.0.0.1:8000/posts/`, {
          content: newPostContent,
          class_instance: classId,
          teacher: "teacher1", // TODO: replace with actual teacher
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
    <div className="posts-tab">
      <div className="posts-tab--center">
        {posts.length > 0 ? (
          posts.map((post) => (
            <Post key={post.id} post={post} setPosts={setPosts} />
          ))
        ) : (
          <div>No posts yet.</div>
        )}
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
        <button
          className={addingPost ? "add-post" : "add-post animate-button"}
          onClick={handleAddPostClick}
        >
          <MdOutlinePostAdd /> Add Post
        </button>
      )}
    </div>
  );
}

export default PostsTab;
