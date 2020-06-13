import React, { useState } from "react";
import { useFollowButtonStyles } from "../../styles";
import { Button } from "@material-ui/core";

function FollowButton({ side }) {
  const classes = useFollowButtonStyles({ side });
  const [following, setFollowing] = useState(false);

  const followBtn = (
    <Button
      variant={side ? "text" : "contained"}
      className={classes.button}
      color="primary"
      fullWidth
      onClick={() => setFollowing(true)}
    >
      Follow
    </Button>
  );
  const followingBtn = (
    <Button
      variant={side ? "outlined" : "text"}
      className={classes.button}
      fullWidth
      onClick={() => setFollowing(false)}
    >
      Following
    </Button>
  );

  return following ? followingBtn : followBtn;
}

export default FollowButton;
