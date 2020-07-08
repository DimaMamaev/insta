import React, { useContext } from "react";
import { useOptionsDialogStyles } from "../../styles";
import { Dialog, Zoom, Button, Divider } from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";
import { defaultPost } from "../../data";
import { UserContext } from "../../App";
import { useMutation } from "@apollo/react-hooks";
import { UNFOLLOW_USER, DELETE_POST } from "../../graphql/mutations";

function OptionsDialog({ onClose, authorId, postId }) {
  const classes = useOptionsDialogStyles();
  const { currentUserId, followingUsers } = useContext(UserContext);
  const isOwner = authorId === currentUserId;
  console.log(authorId, currentUserId);

  const isFollowing = followingUsers.some((id) => id === authorId);
  console.log(isFollowing);

  const unReletedUser = !isOwner && !isFollowing;
  const topBtnMessage = isOwner ? "Delete" : "Unfollow";
  console.log(topBtnMessage);

  const btnMessageOnClick = isOwner ? handleDeletePost : handleUnfollowUser;
  const [unfollowUser] = useMutation(UNFOLLOW_USER);
  const [deletePost] = useMutation(DELETE_POST);
  const history = useHistory();

  async function handleDeletePost() {
    const variables = {
      postId,
      userId: currentUserId,
    };
    await deletePost({ variables });
    onClose();

    history.push("/");
    window.location.reload();
  }
  function handleUnfollowUser() {
    const variables = {
      userIdToFollow: authorId,
      currentUserId,
    };
    unfollowUser({ variables });
    onClose();
  }

  return (
    <Dialog
      open
      classes={{
        scrollPaper: classes.dialogScrollPaper,
      }}
      onClose={onClose}
      TransitionComponent={Zoom}
    >
      {!unReletedUser && (
        <Button onClick={btnMessageOnClick} className={classes.redButton}>
          {topBtnMessage}
        </Button>
      )}
      <Divider />
      <Button className={classes.button}>
        <Link to={`/p/${defaultPost.id}`}>Go to post</Link>
      </Button>
      <Divider />
      <Button className={classes.button}>Share</Button>
      <Divider />
      <Button className={classes.button}>Copy link</Button>
      <Divider />
      <Button onClick={onClose} className={classes.button}>
        Cancel
      </Button>
      <Divider />
    </Dialog>
  );
}

export default OptionsDialog;
