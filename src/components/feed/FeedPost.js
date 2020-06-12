import React, { useState } from "react";
import { useFeedPostStyles } from "../../styles";
import UserCard from "../shared/UserCard";
import { MoreIcon, CommentIcon, ShareIcon } from "../../icons";
import { Link } from "react-router-dom";
import { Typography, Button } from "@material-ui/core";
import HTMLEllipsis from "react-lines-ellipsis/lib/html";

function FeedPost({ post }) {
  const classes = useFeedPostStyles();
  const [showCaption, setCaption] = useState(false);
  const { media, id, likes, user, caption } = post;

  return (
    <>
      <article className={classes.article}>
        <div className={classes.postHeader}>
          <UserCard />
          <MoreIcon className={classes.moreIcon} />
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
          <Typography className={classes.like} variant="subtitile2">
            <span> {likes === 1 ? "1 like" : `${likes} likes `} </span>
          </Typography>
        </div>
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
      </article>
    </>
  );
}

function LikeBtn() {
  return null;
}
function SaveBtn() {
  return null;
}
export default FeedPost;
