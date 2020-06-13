import React, { useState } from "react";
import { useMorePostsFromUserStyles } from "../../styles";
import { Typography, Grid } from "@material-ui/core";
import { LoadingLargeIcon } from "../../icons";
import { getDefaultPost, defaultUser } from "../../data";
import GridPost from "../shared/GridPost";
import { Link } from "react-router-dom";

function MorePostsFromUser() {
  const classes = useMorePostsFromUserStyles();
  const [loading] = useState(false);

  return (
    <div className={classes.container}>
      <Typography
        variant="subtitle2"
        color="textSecondary"
        component="h2"
        className={classes.typography}
        gutterBottom
      >
        More posts from{" "}
        <Link to={`/${defaultUser.username}`} className={classes.link}>
          @{defaultUser.username}
        </Link>
      </Typography>
      {loading ? (
        <LoadingLargeIcon />
      ) : (
        <article className={classes.article}>
          <div className={classes.postContainer}>
            {Array.from({ length: 6 }, () => getDefaultPost()).map((post) => (
              <GridPost key={post.id} post={post} />
            ))}
          </div>
        </article>
      )}
    </div>
  );
}

export default MorePostsFromUser;
