import React from "react";
import { useUserCardStyles } from "../../styles";
import { Link } from "react-router-dom";
import { Avatar, Typography } from "@material-ui/core";
import { defaultCurrentUser } from "../../data";

function UserCard({ user = defaultCurrentUser, avatarSize = 44 }) {
  const classes = useUserCardStyles({ avatarSize });
  const { username, name, profile_image } = user;

  return (
    <div className={classes.wrapper}>
      <Link to={`/${username}`}>
        <Avatar
          src={profile_image}
          className={classes.avatar}
          alt="User avatar"
        />
      </Link>
      <div className={classes.nameWrapper}>
        <Link to={`/${username}`}>
          <Typography variant="subtitle2" className={classes.typography}>
            {" "}
            {username}{" "}
          </Typography>{" "}
        </Link>
        <Typography color="textSecondary" className={classes.typography}>
          {" "}
          {name}{" "}
        </Typography>{" "}
      </div>
    </div>
  );
}

export default UserCard;
