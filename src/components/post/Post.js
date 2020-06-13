import React, { useState } from "react";
import { usePostStyles } from "../../styles";
import UserCard from "../shared/UserCard";
import {
  MoreIcon,
  CommentIcon,
  ShareIcon,
  UnlikeIcon,
  LikeIcon,
  RemoveIcon,
  SaveIcon,
} from "../../icons";
import { Link } from "react-router-dom";
import {
  Typography,
  Button,
  Hidden,
  Divider,
  TextField,
} from "@material-ui/core";
import OptionsDialog from "../shared/OptionsDialog";
import { defaultPost } from "../../data";
import PostSkeleton from "./PostSkeleton";

function Post() {
  const classes = usePostStyles();
  const [showDialogOptions, setDialogOptions] = useState(false);
  const [loading, setLoading] = useState(true);
  const { media, id, likes, user, caption, comments } = defaultPost;

  setTimeout(() => setLoading(false), 3000);
  if (loading) return <PostSkeleton />;

  return (
    <div className={classes.postContainer}>
      <article className={classes.article}>
        <div className={classes.postHeader}>
          <UserCard user={user} avatarSize={32} />
          <MoreIcon
            className={classes.moreIcon}
            onClick={() => setDialogOptions(true)}
          />
        </div>

        <div className={classes.postImage}>
          <img src={media} alt="Post img" className={classes.image} />
        </div>
        <div className={classes.postButtonsWrapper}>
          <div className={classes.postButtons}>
            <LikeBtn />
            <Link to={`/p/${id}`}>
              <CommentIcon />
            </Link>
            <ShareIcon />
            <SaveBtn />
          </div>
          <Typography className={classes.likes} variant="subtitle2">
            <span> {likes === 1 ? "1 like" : `${likes} likes `} </span>
          </Typography>

          <div className={classes.postCaptionContainer}>
            <Typography
              variant="body2"
              className={classes.postCaption}
              component="span"
              dangerouslySetInnerHTML={{ __html: caption }}
            />
            {comments.map((comment) => (
              <div key={comment.id}>
                <Link to={`/${comment.user.username}`}>
                  <Typography
                    variant="subtitle2"
                    component="span"
                    className={classes.commentUsername}
                  >
                    {comment.user.username}
                  </Typography>{" "}
                  <Typography variant="body2" component="span">
                    {comment.content}
                  </Typography>
                </Link>
              </div>
            ))}
          </div>

          <Typography color="textSecondary" className={classes.datePosted}>
            1 DAY AGO
          </Typography>
          <Hidden xsDown>
            <div className={classes.comment}>
              <Divider />
              <Comment />
            </div>
          </Hidden>
        </div>
      </article>
      {showDialogOptions && (
        <OptionsDialog onClose={() => setDialogOptions(false)} />
      )}
    </div>
  );
}

function LikeBtn() {
  const classes = usePostStyles();
  const [like, setLike] = useState(false);
  const Icon = like ? UnlikeIcon : LikeIcon;
  const className = like ? classes.liked : classes.like;
  const onClick = like ? handleUnLike : handleLike;
  function handleUnLike() {
    setLike(false);
  }
  function handleLike() {
    setLike(true);
  }
  return <Icon className={className} onClick={onClick} />;
}
function SaveBtn() {
  const classes = usePostStyles();
  const [save, setSave] = useState(false);
  const Icon = save ? RemoveIcon : SaveIcon;
  const onClick = save ? handleUnSave : handleSave;
  function handleUnSave() {
    setSave(false);
  }
  function handleSave() {
    setSave(true);
  }
  return <Icon className={classes.saveIcon} onClick={onClick} />;
}
function Comment() {
  const classes = usePostStyles();
  const [text, setText] = useState("");
  return (
    <div className={classes.commentContainer}>
      <TextField
        fullWidth
        value={text}
        placeholder="Add a comment"
        multiline
        rowsMax={2}
        rows={1}
        className={classes.textField}
        onChange={(event) => setText(event.target.value)}
        inputProps={{
          classes: {
            root: classes.root,
            underline: classes.underline,
          },
        }}
      />
      <Button
        color="primary"
        className={classes.commentButton}
        disabled={!text.trim()}
      >
        Post
      </Button>
    </div>
  );
}
export default Post;
