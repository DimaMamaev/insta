import React, { useContext } from "react";
import { useExploreGridStyles } from "../../styles";
import { Typography } from "@material-ui/core";
import { LoadingLargeIcon } from "../../icons";
import GridPost from "../shared/GridPost";
import { useQuery } from "@apollo/react-hooks";
import { EXPLORE_POSTS } from "../../graphql/queries";
import { UserContext } from "../../App";

function ExploreGrid() {
  const classes = useExploreGridStyles();
  const { followingUsers } = useContext(UserContext);
  const variables = {
    feedIds: followingUsers,
  };
  const { data, loading } = useQuery(EXPLORE_POSTS, { variables });

  return (
    <>
      <Typography
        variant="subtitle2"
        color="textSecondary"
        component="h2"
        className={classes.typography}
        gutterBottom
      >
        Explore
      </Typography>
      {loading ? (
        <LoadingLargeIcon />
      ) : (
        <article className={classes.article}>
          <div className={classes.postContainer}>
            {data.posts.map((post) => (
              <GridPost key={post.id} post={post} />
            ))}
          </div>
        </article>
      )}
    </>
  );
}

export default ExploreGrid;
