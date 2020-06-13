import React from "react";
import { useFeedSideSuggestionsStyles } from "../../styles";
import { Paper, Typography } from "@material-ui/core";
import UserCard from "../shared/UserCard";
import FollowButton from "../shared/FollowButton";
import { getDefaultUser } from "../../data";
import { LoadingIcon } from "../../icons";

function FeedSideSuggestions() {
  const classes = useFeedSideSuggestionsStyles();
  let loading = false;
  return (
    <article className={classes.article}>
      <Paper className={classes.paper}>
        <Typography
          variant="subtitle2"
          color="textSecondary"
          component="h2"
          align="left"
          gutterBottom
          className={classes.typography}
        >
          Suggestions for you
        </Typography>
        {loading ? (
          <LoadingIcon />
        ) : (
          Array.from({ length: 5 }, () => getDefaultUser()).map((user) => (
            <div key={user.id} className={classes.card}>
              <UserCard user={user} avatarSize={35} />
              <FollowButton side />
            </div>
          ))
        )}
      </Paper>
    </article>
  );
}

export default FeedSideSuggestions;
