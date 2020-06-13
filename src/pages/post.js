import React from "react";
import Layout from "../components/shared/Layout";
import Post from "../components/post/Post";
import { useParams } from "react-router-dom";
import MorePostsFromUser from "../components/post/MorePostsFromUser";

function PostPage() {
  const { postId } = useParams();
  return (
    <Layout>
      <Post id={postId} />
      <MorePostsFromUser />
    </Layout>
  );
}

export default PostPage;
