import React, { useContext } from "react";
import { useFeedSideSuggestionsStyles } from "../../styles";
import { Paper, Typography } from "@material-ui/core";
import UserCard from "../shared/UserCard";
import FollowButton from "../shared/FollowButton";
import { LoadingIcon } from "../../icons";
import { useQuery } from "@apollo/react-hooks";
import { SUGGEST_USERS } from "../../graphql/queries";
import { UserContext } from "../../App";

function FeedSideSuggestions() {
  const classes = useFeedSideSuggestionsStyles();
  const { currentUser, followersUsers } = useContext(UserContext);
  const variables = {
    limit: 5,
    followerIds: followersUsers,
    createdAt: currentUser.created_at,
  };
  const { data, loading } = useQuery(SUGGEST_USERS, { variables });

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
          data.users.map((user) => (
            <div key={user.id} className={classes.card}>
              <UserCard user={user} avatarSize={35} />
              <FollowButton id={user.id} side />
            </div>
          ))
        )}
      </Paper>
    </article>
  );
}

export default FeedSideSuggestions;
