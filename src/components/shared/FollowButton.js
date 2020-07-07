import React, { useState, useContext } from "react";
import { useFollowButtonStyles } from "../../styles";
import { Button } from "@material-ui/core";
import { UserContext } from "../../App";
import { useMutation } from "@apollo/react-hooks";
import { FOLLOW_USER, UNFOLLOW_USER } from "../../graphql/mutations";

function FollowButton({ side, id }) {
  const classes = useFollowButtonStyles({ side });
  const { currentUserId, followingUsers } = useContext(UserContext);
  const isAlreadyFollowing = followingUsers.some(
    (followingId) => followingId === id
  );
  const [following, setFollowing] = useState(isAlreadyFollowing);
  const [followUser] = useMutation(FOLLOW_USER);
  const [unfollowUser] = useMutation(UNFOLLOW_USER);
  const variables = {
    userIdToFollow: id,
    currentUserId,
  };
  function handleFollowUser() {
    setFollowing(true);
    followUser({ variables });
  }
  function handleUnFollowUser() {
    setFollowing(false);
    unfollowUser({ variables });
  }

  const followBtn = (
    <Button
      variant={side ? "text" : "contained"}
      className={classes.button}
      color="primary"
      fullWidth
      onClick={handleFollowUser}
    >
      Follow
    </Button>
  );
  const followingBtn = (
    <Button
      variant={side ? "outlined" : "text"}
      className={classes.button}
      fullWidth
      onClick={handleUnFollowUser}
    >
      Following
    </Button>
  );

  return following ? followingBtn : followBtn;
}

export default FollowButton;
