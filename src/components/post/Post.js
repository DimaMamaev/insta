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
  Avatar,
} from "@material-ui/core";
import OptionsDialog from "../shared/OptionsDialog";
import PostSkeleton from "./PostSkeleton";
import { useSubscription } from "@apollo/react-hooks";
import { GET_POST } from "../../graphql/subscriptions";
import { formatDateToNowShort } from "../../utils/formatDate";

function Post({ postId }) {
  const classes = usePostStyles();
  const [showDialogOptions, setDialogOptions] = useState(false);
  postId = "30838aa6-8d53-4ff1-b283-75b92f71ba85";
  const variables = { postId };

  const { data, loading } = useSubscription(GET_POST, { variables });
  console.log(data);

  if (loading) return <PostSkeleton />;
  const {
    media,
    id,
    likes,
    likes_aggregate,
    saved_post,
    user,
    caption,
    comments,
    created_at,
    location,
  } = data.posts_by_pk;
  console.log(data.posts_by_pk);
  const likesCount = likes_aggregate.aggregate.count;
  return (
    <div className={classes.postContainer}>
      <article className={classes.article}>
        <div className={classes.postHeader}>
          <UserCard user={user} avatarSize={32} location={location} />
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
            <span>
              {" "}
              {likesCount === 1 ? "1 like" : `${likesCount} likes `}{" "}
            </span>
          </Typography>

          <div
            style={{
              overflowY: "scroll",
              padding: "15px 10px",
              height: "100%",
            }}
          >
            <AuthorCaption
              user={user}
              createdAt={created_at}
              caption={caption}
            />
            {comments.map((comment) => (
              <UserComment comment={comment} key={comment.id} />
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

function AuthorCaption({ user, caption, createdAt }) {
  const classes = usePostStyles();

  return (
    <div style={{ display: "flex" }}>
      <Avatar
        src={user.profile_image}
        alt="User avatar"
        style={{ marginRight: 14, width: 35, height: 35 }}
      />
      <div style={{ display: "flex", flexDirection: "column " }}>
        <Link to={user.username}>
          <Typography
            variant="subtitle2"
            component="span"
            className={classes.username}
          >
            {user.username}
          </Typography>
          <Typography
            variant="body2"
            component="span"
            className={classes.postCaption}
            style={{ paddingLeft: 0 }}
            dangerouslySetInnerHTML={{ __html: caption }}
          />
        </Link>
        <Typography
          style={{ marginTop: 5, marginBottom: 5, display: "inline-block" }}
          color="textSecondary"
          variant="caption"
        >
          {formatDateToNowShort(createdAt)}
        </Typography>
      </div>
    </div>
  );
}

function UserComment({ comment }) {
  const classes = usePostStyles();

  return (
    <div style={{ display: "flex" }}>
      <Avatar
        src={comment.user.profile_image}
        alt="User avatar"
        style={{ marginRight: 14, width: 32, height: 32 }}
      />
      <div style={{ display: "flex", flexDirection: "column " }}>
        <Link to={comment.user.username}>
          <Typography
            variant="subtitle2"
            component="span"
            className={classes.username}
          >
            {comment.user.username}
          </Typography>
          <Typography
            variant="body2"
            component="span"
            className={classes.postCaption}
            style={{ paddingLeft: 0 }}
          >
            {comment.content}
          </Typography>
        </Link>
        <Typography
          style={{ marginTop: 10, marginBottom: 5, display: "inline-block" }}
          color="textSecondary"
          variant="caption"
        >
          {formatDateToNowShort(comment.created_at)}
        </Typography>
      </div>
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
