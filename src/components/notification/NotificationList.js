import React, { useRef, useEffect } from "react";
import { useNotificationListStyles } from "../../styles";
import { Grid, Avatar, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import FollowButton from "../shared/FollowButton";
import useOutsideClick from "@rooks/use-outside-click";
import { formatDateToNowShort } from "../../utils/formatDate";
import { useMutation } from "@apollo/react-hooks";
import { CHECK_NOTIFICATIONS } from "../../graphql/mutations";

function NotificationList({ handleHideList, notifications, currentUserId }) {
  const classes = useNotificationListStyles();
  const listContainerRef = useRef();
  useOutsideClick(listContainerRef, handleHideList);
  const [checkNotificationsList] = useMutation(CHECK_NOTIFICATIONS);

  useEffect(() => {
    const variables = {
      userId: currentUserId,
      lastChecked: new Date().toISOString(),
    };
    checkNotificationsList({ variables });
  }, [currentUserId, checkNotificationsList]);

  return (
    <Grid ref={listContainerRef} container className={classes.listContainer}>
      {notifications.map((notification) => {
        const isLiked = notification.type === "like";
        const isFollow = notification.type === "follow";

        return (
          <Grid key={notification.id} item className={classes.listItem}>
            <div className={classes.listItemWrapper}>
              <div className={classes.avatarWrapper}>
                <Avatar
                  src={notification.user.profile_image}
                  alt="User avatar"
                />
              </div>
              <div className={classes.nameWrapper}>
                <Link to={`/${notification.user.username}`}>
                  <Typography variant="body1">
                    {notification.user.username}
                  </Typography>
                </Link>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  className={classes.typography}
                >
                  {isLiked &&
                    `Likes your photo. ${formatDateToNowShort(
                      notification.created_at
                    )}`}
                  {isFollow &&
                    `Started following you. ${formatDateToNowShort(
                      notification.created_at
                    )} `}
                </Typography>
              </div>
            </div>
            <div>
              {isLiked && (
                <Link to={`/p/${notification.post.id}`}>
                  <Avatar src={notification.post.media} alt="Post cover" />
                </Link>
              )}
              {isFollow && <FollowButton id={notification.user.id} />}
            </div>
          </Grid>
        );
      })}
    </Grid>
  );
}

export default NotificationList;
