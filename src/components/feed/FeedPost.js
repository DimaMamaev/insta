import React, { useState } from "react";
import { useFeedPostStyles } from "../../styles";
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
import HTMLEllipsis from "react-lines-ellipsis/lib/html";
import FollowSuggestions from "../shared/FollowSuggestions";
import OptionsDialog from "../shared/OptionsDialog";

function FeedPost({ post, index }) {
  const classes = useFeedPostStyles();
  const [showCaption, setCaption] = useState(false);
  const [showDialogOptions, setDialogOptions] = useState(false);
  const { media, id, likes, user, caption, comments } = post;
  const showFollowSuggestions = index === 1;

  return (
    <>
      <article
        className={classes.article}
        style={{ marginBottom: showFollowSuggestions && 30 }}
      >
        <div className={classes.postHeader}>
          <UserCard user={user} />
          <MoreIcon
            className={classes.moreIcon}
            onClick={() => setDialogOptions(true)}
          />
        </div>

        <div>
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
          <Typography className={classes.likes} variant="subtitile2">
            <span> {likes === 1 ? "1 like" : `${likes} likes `} </span>
          </Typography>

          <div className={showCaption ? classes.expanded : classes.collapsed}>
            <Link to={`/${user.username}`}>
              <Typography
                variant="subtitle2"
                className={classes.username}
                component="span"
              >
                {user.username}
              </Typography>
            </Link>
            {showCaption ? (
              <Typography
                component="span"
                variant="body2"
                dangerouslySetInnerHTML={{ __html: caption }}
              />
            ) : (
              <div className={classes.captionWrapper}>
                <HTMLEllipsis
                  unsafeHTML={caption}
                  className={classes.caption}
                  maxLine="0"
                  ellipsis="..."
                  basedOn="letters"
                />
                <Button
                  className={classes.moreButton}
                  onClick={() => setCaption(true)}
                >
                  more
                </Button>
              </div>
            )}
          </div>
          <Link to={`/p/${id}`}>
            <Typography
              className={classes.commentsLink}
              variant="body2"
              component="div"
            >
              View all {comments.length} comments.
            </Typography>
          </Link>
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
          <Typography color="textSecondary" className={classes.datePosted}>
            1 DAY AGO
          </Typography>
        </div>
        <Hidden xsDown>
          <Divider />
          <Comment />
        </Hidden>
      </article>
      {showFollowSuggestions && <FollowSuggestions />}
      {showDialogOptions && (
        <OptionsDialog onClose={() => setDialogOptions(false)} />
      )}
    </>
  );
}

function LikeBtn() {
  const classes = useFeedPostStyles();
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
  const classes = useFeedPostStyles();
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
  const classes = useFeedPostStyles();
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
export default FeedPost;
