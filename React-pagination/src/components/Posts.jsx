import React from "react";

const Posts = ({ posts }) => {
  return (
    <div className="posts">
      {posts.map((post) => (
        <div className="post" key={post.id}>
          <h2 className="post-title">{post.title.slice(0, 15)}</h2>
        </div>
      ))}
    </div>
  );
};

export default Posts;
