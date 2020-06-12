import React from "react";
import { useFeedPostStyles } from "../../styles";
import UserCard from "../shared/UserCard";
import { MoreIcon, CommentIcon } from "../../icons";
import { Link } from "react-router-dom";

function FeedPost({ post }) {
  const classes = useFeedPostStyles();
  const { media, id } = post;

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
          </div>
        </div>
      </article>
    </>
  );
}

function LikeBtn() {
  return null;
}

export default FeedPost;
