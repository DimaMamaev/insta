import React, { useEffect } from "react";
import { useMorePostsFromUserStyles } from "../../styles";
import { Typography } from "@material-ui/core";
import { LoadingLargeIcon } from "../../icons";
import GridPost from "../shared/GridPost";
import { Link } from "react-router-dom";
import { useQuery, useLazyQuery } from "@apollo/react-hooks";
import { GET_POSTS, GET_MORE_POSTS_FROM_USER } from "../../graphql/queries";

function MorePostsFromUser({ postId }) {
  const classes = useMorePostsFromUserStyles();
  const variables = {
    postId,
  };
  const { data, loading } = useQuery(GET_POSTS, { variables });
  const [
    getMorePostsFromUser,
    { data: morePosts, loading: morePostsLoading },
  ] = useLazyQuery(GET_MORE_POSTS_FROM_USER);

  useEffect(() => {
    if (loading) return;
    const userId = data.posts_by_pk.user.id;
    const postId = data.posts_by_pk.id;
    const variables = {
      userId,
      postId,
    };
    getMorePostsFromUser({ variables });
  }, [data, loading, getMorePostsFromUser]);

  return (
    <div className={classes.container}>
      {loading || morePostsLoading ? (
        <LoadingLargeIcon />
      ) : (
        <>
          <Typography
            variant="subtitle2"
            color="textSecondary"
            component="h2"
            className={classes.typography}
            gutterBottom
          >
            More posts from{" "}
            <Link
              to={`/${data.posts_by_pk.user.username}`}
              className={classes.link}
            >
              @{data.posts_by_pk.user.username}
            </Link>
          </Typography>

          <article className={classes.article}>
            <div className={classes.postContainer}>
              {morePosts?.posts.map((post) => (
                <GridPost key={post.id} post={post} />
              ))}
            </div>
          </article>
        </>
      )}
    </div>
  );
}

export default MorePostsFromUser;
