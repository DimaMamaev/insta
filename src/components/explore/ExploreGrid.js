import React, { useState } from "react";
import { useExploreGridStyles } from "../../styles";
import { Typography, Grid } from "@material-ui/core";
import { LoadingLargeIcon } from "../../icons";
import { getDefaultPost } from "../../data";
import GridPost from "../shared/GridPost";

function ExploreGrid() {
  const classes = useExploreGridStyles();
  const [loading] = useState(false);

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
            {Array.from({ length: 12 }, () => getDefaultPost()).map((post) => (
              <GridPost key={post.id} post={post} />
            ))}
          </div>
        </article>
      )}
    </>
  );
}

export default ExploreGrid;
