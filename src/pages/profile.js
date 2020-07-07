import React, { useState, useContext, useCallback } from "react";
import { useProfilePageStyles } from "../styles";
import Layout from "../components/shared/Layout";
import {
  Hidden,
  Card,
  CardContent,
  Button,
  Typography,
  Dialog,
  Zoom,
  Divider,
  DialogTitle,
  Avatar,
} from "@material-ui/core";
import ProfilePicture from "../components/shared/ProfilePicture";
import { Link, useHistory, useParams } from "react-router-dom";
import { GearIcon } from "../icons";
import ProfileTabs from "../components/profile/ProfileTabs";
import { AuthContext } from "../auth";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { GET_USER_PROFILE } from "../graphql/queries";
import LoadingScreen from "../components/shared/LoadingScreen";
import { UserContext } from "../App";
import { FOLLOW_USER, UNFOLLOW_USER } from "../graphql/mutations";
import { useApolloClient } from "@apollo/react-hooks";

function ProfilePage() {
  const { username } = useParams();
  const { currentUserId } = useContext(UserContext);
  const classes = useProfilePageStyles();
  const [showOptions, setOptions] = useState(false);
  const variables = { username };
  const { data, loading } = useQuery(GET_USER_PROFILE, {
    variables,
    fetchPolicy: "no-cache",
  });

  if (loading) return <LoadingScreen />;

  const [user] = data.users;

  const isOwner = user.id === currentUserId;

  function handleMenuOptions() {
    setOptions(true);
  }
  function handleMenuOptionsOnClose() {
    setOptions(false);
  }

  return (
    <Layout title={`${user.name} (@${user.username})`}>
      <div className={classes.container}>
        <Hidden xsDown>
          <Card className={classes.cardLarge}>
            <ProfilePicture image={user.profile_image} isOwner={isOwner} />
            <CardContent className={classes.cardContentLarge}>
              <ProfileNameSection
                user={user}
                isOwner={isOwner}
                handleMenuOptions={handleMenuOptions}
              />
              <PostCountSection user={user} />
              <NameBioSection user={user} />
            </CardContent>
          </Card>
        </Hidden>
        <Hidden smUp>
          <Card className={classes.cardSmall}>
            <CardContent>
              <section className={classes.sectionSmall}>
                <ProfilePicture
                  image={user.profile_image}
                  isOwner={isOwner}
                  size={75}
                />
                <ProfileNameSection
                  user={user}
                  isOwner={isOwner}
                  handleMenuOptions={handleMenuOptions}
                />
              </section>
              <NameBioSection user={user} />
            </CardContent>
            <PostCountSection user={user} />
          </Card>
        </Hidden>
        {showOptions && (
          <OptionsMenu handleMenuOptionsOnClose={handleMenuOptionsOnClose} />
        )}
        <ProfileTabs user={user} isOwner={isOwner} />
      </div>
    </Layout>
  );
}
function ProfileNameSection({ user, isOwner, handleMenuOptions }) {
  const classes = useProfilePageStyles();
  let followBtn;

  const [showUnfollowDialog, setUnfollowDialog] = useState(false);
  const { currentUserId, followersUsers, followingUsers } = useContext(
    UserContext
  );
  const isAlreadyFollowing = followingUsers.some((id) => id === user.id);
  const [isFollowing, setFollowing] = useState(isAlreadyFollowing);
  const isFollower =
    !isFollowing && followersUsers.some((id) => id === user.id);
  const variables = {
    userIdToFollow: user.id,
    currentUserId,
  };
  const [followUser] = useMutation(FOLLOW_USER);
  function handleFollowUser() {
    setFollowing(true);
    followUser({ variables });
  }
  const onUnFollowUser = useCallback(() => {
    setUnfollowDialog(false);
    setFollowing(false);
  }, []);

  if (isFollowing) {
    followBtn = (
      <Button
        variant="outlined"
        onClick={() => setUnfollowDialog(true)}
        className={classes.button}
      >
        Following
      </Button>
    );
  } else if (isFollower) {
    followBtn = (
      <Button
        onClick={handleFollowUser}
        variant="contained"
        color="primary"
        className={classes.button}
      >
        Follow Back
      </Button>
    );
  } else {
    followBtn = (
      <Button
        onClick={handleFollowUser}
        variant="contained"
        color="primary"
        className={classes.button}
      >
        Follow
      </Button>
    );
  }
  return (
    <>
      <Hidden xsDown>
        <section className={classes.usernameSection}>
          <Typography className={classes.username}>{user.username}</Typography>
          {isOwner ? (
            <>
              <Link to="/accounts/edit">
                <Button variant="outlined">Edit profile</Button>
              </Link>
              <div
                className={classes.settingsWrapper}
                onClick={handleMenuOptions}
              >
                <GearIcon className={classes.settings} />
              </div>
            </>
          ) : (
            <>{followBtn}</>
          )}
        </section>
      </Hidden>
      <Hidden smUp>
        <section>
          <div className={classes.usernameDivSmall}>
            <Typography className={classes.username}>
              {user.username}
            </Typography>
            {isOwner && <GearIcon className={classes.settings} />}
          </div>
          {isOwner ? (
            <Link to="/accounts/edit">
              <Button variant="outlined" style={{ width: "100%" }}>
                Edit profile
              </Button>
            </Link>
          ) : (
            followBtn
          )}
        </section>
      </Hidden>
      {showUnfollowDialog && (
        <UnfollowingDialog
          onUnFollowUser={onUnFollowUser}
          onClose={() => setUnfollowDialog(false)}
          user={user}
        />
      )}
    </>
  );
}

function UnfollowingDialog({ onClose, user, onUnFollowUser }) {
  const classes = useProfilePageStyles();
  const { currentUserId } = useContext(UserContext);
  const [unFollowUser] = useMutation(UNFOLLOW_USER);
  function handleUnFollowUser() {
    const variables = {
      userIdToFollow: user.id,
      currentUserId,
    };
    unFollowUser({ variables });
    onUnFollowUser();
  }

  return (
    <Dialog
      open
      classes={{
        scrollPaper: classes.unfollowDialogScrollPaper,
      }}
      onClose={onClose}
      TransitionComponent={Zoom}
    >
      <div className={classes.wrapper}>
        <Avatar
          src={user.profile_image}
          alt="user avatar"
          className={classes.avatar}
        />
      </div>
      <Typography
        align="center"
        className={classes.unfollowDialogText}
        variant="body2"
      >
        Unfollow @{user.username} ?
      </Typography>
      <Divider />
      <Button onClick={handleUnFollowUser} className={classes.unfollowButton}>
        Unfollow
      </Button>
      <Divider />
      <Button onClick={onClose} className={classes.cancelButton}>
        Cancel
      </Button>
    </Dialog>
  );
}

function PostCountSection({ user }) {
  const classes = useProfilePageStyles();
  const optionsList = ["posts", "followers", "following"];

  return (
    <>
      <Hidden smUp>
        <Divider />
      </Hidden>
      <section className={classes.followingSection}>
        {optionsList.map((option) => (
          <div key={option} className={classes.followingText}>
            <Typography className={classes.followingCount}>
              {user[`${option}_aggregate`].aggregate.count}
            </Typography>
            <Hidden xsDown>
              <Typography>{option}</Typography>
            </Hidden>
            <Hidden smUp>
              <Typography color="textSecondary">{option}</Typography>
            </Hidden>
          </div>
        ))}
      </section>
      <Hidden smUp>
        <Divider />
      </Hidden>
    </>
  );
}
function NameBioSection({ user }) {
  const classes = useProfilePageStyles();
  const { name, bio, website } = user;

  return (
    <section className={classes.section}>
      <Typography className={classes.typography}>{name}</Typography>
      <Typography className={classes.typography}>{bio}</Typography>
      <a href={website} target="_blank" rel="noopener noreferrer">
        <Typography className={classes.typography} color="secondary">
          {website}
        </Typography>
      </a>
    </section>
  );
}
function OptionsMenu({ handleMenuOptionsOnClose }) {
  const classes = useProfilePageStyles();
  const { signOut } = useContext(AuthContext);
  const [showLogOut, setLogOut] = useState(false);
  const history = useHistory();
  const client = useApolloClient();

  function handlerLogOutShow() {
    setLogOut(true);
    setTimeout(async () => {
      await client.clearStore();
      signOut();
      history.push("/accounts/login");
    }, 3000);
  }

  return (
    <Dialog
      open
      classes={{
        scrollPaper: classes.dialogScrollPaper,
        paper: classes.dialogPaper,
      }}
      TransitionComponent={Zoom}
    >
      {showLogOut ? (
        <DialogTitle className={classes.dialogTitle}>
          Loggin Out
          <Typography color="textSecondary">
            You need to log back to continue using Insta clone!
          </Typography>
        </DialogTitle>
      ) : (
        <>
          <OptionsListItem text="Change password" />
          <OptionsListItem text="Nametag" />
          <OptionsListItem text="Authorized Apps" />
          <OptionsListItem text="Notifications" />
          <OptionsListItem text="Privacy and Security" />
          <OptionsListItem text="Log out" onClick={handlerLogOutShow} />
          <OptionsListItem text="Cancel" onClick={handleMenuOptionsOnClose} />
        </>
      )}
    </Dialog>
  );
}

function OptionsListItem({ text, onClick }) {
  return (
    <>
      <Button style={{ padding: "12px 8px" }} onClick={onClick}>
        {text}
      </Button>
      <Divider />
    </>
  );
}

export default ProfilePage;
