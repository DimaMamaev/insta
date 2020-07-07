import React, { useContext } from "react";
import { useFollowSuggestionsStyles } from "../../styles";
import { Typography, Avatar } from "@material-ui/core";
import { LoadingLargeIcon } from "../../icons";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";
import FollowButton from "./FollowButton";
import { UserContext } from "../../App";
import { SUGGEST_USERS } from "../../graphql/queries";
import { useQuery } from "@apollo/react-hooks";

function FollowSuggestions({ hideHeader }) {
  const classes = useFollowSuggestionsStyles();
  const { followersUsers, currentUser } = useContext(UserContext);
  const variables = {
    limit: 10,
    followerIds: followersUsers,
    createdAt: currentUser.created_at,
  };
  const { data, loading } = useQuery(SUGGEST_USERS, { variables });

  return (
    <div className={classes.container}>
      {!hideHeader && (
        <Typography
          color="textSecondary"
          variant="subtitle2"
          className={classes.typography}
        >
          Suggestions For you
        </Typography>
      )}
      {loading ? (
        <LoadingLargeIcon />
      ) : (
        <Slider
          className={classes.slide}
          dots={false}
          infinite
          speed={1000}
          touchThreshold={1000}
          variableWidth
          swipeToSlide
          arrows
          slidesToScroll={3}
          easing="ease-in-out"
        >
          {data.users.map((user) => (
            <FollowSuggestionsItems key={user.id} user={user} />
          ))}
        </Slider>
      )}
    </div>
  );
}

function FollowSuggestionsItems({ user }) {
  const classes = useFollowSuggestionsStyles();
  const { profile_image, name, username, id } = user;
  return (
    <div>
      <div className={classes.card}>
        <Link to={`/${username}`}>
          <Avatar
            src={profile_image}
            alt="User avatar"
            classes={{
              root: classes.avatar,
              img: classes.avatarImg,
            }}
          />
        </Link>
        <Link to={`/${username}`}>
          <Typography
            variant="subtitle2"
            className={classes.text}
            align="center"
          >
            {username}
          </Typography>
        </Link>
        <Typography
          variant="body2"
          color="textSecondary"
          align="center"
          className={classes.text}
        >
          {name}
        </Typography>
        <FollowButton id={id} side={false} />
      </div>
    </div>
  );
}

export default FollowSuggestions;
