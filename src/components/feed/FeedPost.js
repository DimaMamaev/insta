import React, { useState, useContext } from "react";
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
import { formatDateToNow } from "../../utils/formatDate";
import Img from "react-graceful-image";
import { UserContext } from "../../App";
import { useMutation } from "@apollo/react-hooks";
import {
  LIKE_POST,
  UNLIKE_POST,
  SAVE_POST,
  UNSAVE_POST,
} from "../../graphql/mutations";
import { GET_FEED } from "../../graphql/queries";

function FeedPost({ post, index }) {
  const classes = useFeedPostStyles();
  const [showCaption, setCaption] = useState(false);
  const [showDialogOptions, setDialogOptions] = useState(false);
  const {
    media,
    id,
    likes,
    likes_aggregate,
    user,
    caption,
    comments,
    comments_aggregate,
    saved_posts,
    location,
    created_at,
  } = post;
  const showFollowSuggestions = index === 1;
  const likesCount = likes_aggregate.aggregate.count;
  const commentsCount = comments_aggregate.aggregate.count;

  return (
    <>
      <article
        className={classes.article}
        style={{ marginBottom: showFollowSuggestions && 30 }}
      >
        <div className={classes.postHeader}>
          <UserCard user={user} location={location} />
          <MoreIcon
            className={classes.moreIcon}
            onClick={() => setDialogOptions(true)}
          />
        </div>

        <div>
          <Img src={media} alt="Post img" className={classes.image} />
        </div>
        <div className={classes.postButtonsWrapper}>
          <div className={classes.postButtons}>
            <LikeBtn likes={likes} postId={id} authorId={user.id} />
            <Link to={`/p/${id}`}>
              <CommentIcon />
            </Link>
            <ShareIcon />
            <SaveBtn savedPosts={saved_posts} postId={id} />
          </div>
          <Typography className={classes.likes} variant="subtitle2">
            <span>
              {" "}
              {likesCount === 1 ? "1 like" : `${likesCount} likes `}{" "}
            </span>
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
              View all {commentsCount} comments.
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
            {formatDateToNow(created_at)}
          </Typography>
        </div>
        <Hidden xsDown>
          <Divider />
          <Comment />
        </Hidden>
      </article>
      {showFollowSuggestions && <FollowSuggestions />}
      {showDialogOptions && (
        <OptionsDialog
          postId={id}
          authorId={user.id}
          onClose={() => setDialogOptions(false)}
        />
      )}
    </>
  );
}

function LikeBtn({ likes, postId, authorId }) {
  const classes = useFeedPostStyles();
  const { currentUserId, feedUsers } = useContext(UserContext);
  const isAlreadyLiked = likes.some(({ user_id }) => user_id === currentUserId);

  const [like, setLike] = useState(isAlreadyLiked);
  const Icon = like ? UnlikeIcon : LikeIcon;
  const className = like ? classes.liked : classes.like;
  const onClick = like ? handleUnLike : handleLike;

  const [likePost] = useMutation(LIKE_POST);
  const [unlikePost] = useMutation(UNLIKE_POST);
  const variables = {
    postId,
    userId: currentUserId,
    profileId: authorId,
  };

  function handleUpdate(cache, result) {
    const variables = { limit: 2, feedIds: feedUsers };
    const data = cache.readQuery({
      query: GET_FEED,
      variables,
    });
    const typename = result.data.insert_likes?.__typename;
    const count = typename === "likes_mutation_response" ? 1 : -1;
    const posts = data.posts.map((post) => ({
      ...post,
      likes_aggregate: {
        ...post.likes_aggregate,
        aggregate: {
          ...post.likes_aggregate.aggregate,
          count: post.likes_aggregate.aggregate.count + count,
        },
      },
    }));
    cache.writeQuery({ query: GET_FEED, data: { posts } });
  }
  function handleUnLike() {
    setLike(false);
    unlikePost({ variables, update: handleUpdate });
  }
  function handleLike() {
    setLike(true);
    likePost({ variables, update: handleUpdate });
  }
  return <Icon className={className} onClick={onClick} />;
}
function SaveBtn({ postId, savedPosts }) {
  const classes = useFeedPostStyles();
  const { currentUserId } = useContext(UserContext);
  const isAlreadySaved = savedPosts.some(
    ({ user_id }) => user_id === currentUserId
  );
  const [save, setSave] = useState(isAlreadySaved);
  const Icon = save ? RemoveIcon : SaveIcon;
  const onClick = save ? handleUnSave : handleSave;
  const [savePost] = useMutation(SAVE_POST);
  const [removePost] = useMutation(UNSAVE_POST);
  const variables = {
    postId,
    userId: currentUserId,
  };

  function handleUnSave() {
    setSave(false);
    removePost({ variables });
  }
  function handleSave() {
    setSave(true);
    savePost({ variables });
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
