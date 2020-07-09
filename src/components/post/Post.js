import React, { useState, useContext } from "react";
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
import { useSubscription, useMutation } from "@apollo/react-hooks";
import { GET_POST } from "../../graphql/subscriptions";
import { formatDateToNowShort, formatPostDate } from "../../utils/formatDate";
import { UserContext } from "../../App";
import {
  LIKE_POST,
  UNLIKE_POST,
  SAVE_POST,
  UNSAVE_POST,
  CREATE_COMMENT,
} from "../../graphql/mutations";
import Img from "react-graceful-image";

function Post({ postId }) {
  const classes = usePostStyles();
  const [showDialogOptions, setDialogOptions] = useState(false);
  const variables = { postId };

  const { data, loading } = useSubscription(GET_POST, { variables });

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
          <Img src={media} alt="Post img" className={classes.image} />
        </div>
        <div className={classes.postButtonsWrapper}>
          <div className={classes.postButtons}>
            <LikeBtn likes={likes} postId={id} authorId={user.id} />
            <Link to={`/p/${id}`}>
              <CommentIcon />
            </Link>
            <ShareIcon />
            <SaveBtn savedPosts={saved_post} postId={id} />
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
              <UserComment
                postId={id}
                authorId={user.id}
                comment={comment}
                key={comment.id}
              />
            ))}
          </div>

          <Typography color="textSecondary" className={classes.datePosted}>
            {formatPostDate(created_at)}
          </Typography>
          <Hidden xsDown>
            <div className={classes.comment}>
              <Divider />
              <Comment postId={id} />
            </div>
          </Hidden>
        </div>
      </article>
      {showDialogOptions && (
        <OptionsDialog
          postId={id}
          authorId={user.id}
          onClose={() => setDialogOptions(false)}
        />
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
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Link to={`/${user.username}`}>
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
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Link to={`/${comment.user.username}`}>
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

function LikeBtn({ likes, postId, authorId }) {
  const classes = usePostStyles();
  const { currentUserId } = useContext(UserContext);
  const isAlreadyLiked = likes.some(({ user_id }) => user_id === currentUserId);
  const [like, setLike] = useState(isAlreadyLiked);
  const Icon = like ? UnlikeIcon : LikeIcon;
  const className = like ? classes.liked : classes.like;
  const onClick = like ? handleUnLike : handleLike;
  const variables = {
    postId,
    userId: currentUserId,
    profileId: authorId,
  };
  const [likePost] = useMutation(LIKE_POST);
  const [unLikePost] = useMutation(UNLIKE_POST);

  function handleUnLike() {
    setLike(false);
    unLikePost({ variables });
  }
  function handleLike() {
    setLike(true);
    likePost({ variables });
  }
  return <Icon className={className} onClick={onClick} />;
}
function SaveBtn({ savedPosts, postId }) {
  const classes = usePostStyles();
  const { currentUserId } = useContext(UserContext);
  const isAlreadySaved = savedPosts.some(
    ({ user_id }) => user_id === currentUserId
  );

  const [save, setSave] = useState(isAlreadySaved);
  const Icon = save ? RemoveIcon : SaveIcon;
  const onClick = save ? handleUnSave : handleSave;
  const variables = {
    postId,
    userId: currentUserId,
  };
  const [savePost] = useMutation(SAVE_POST);
  const [unSavePost] = useMutation(UNSAVE_POST);

  function handleUnSave() {
    unSavePost({ variables });

    setSave(false);
  }
  function handleSave() {
    savePost({ variables });
    setSave(true);
  }
  return <Icon className={classes.saveIcon} onClick={onClick} />;
}
function Comment({ postId }) {
  const classes = usePostStyles();
  const { currentUserId } = useContext(UserContext);
  const [text, setText] = useState("");
  const [createComment] = useMutation(CREATE_COMMENT);

  const variables = {
    postId,
    content: text,
    userId: currentUserId,
  };
  function handleAddComments() {
    createComment({ variables });
    setText("");
  }

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
        onClick={handleAddComments}
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
