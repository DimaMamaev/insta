import React, { useState } from "react";
import { useProfilePageStyles } from "../styles";
import Layout from "../components/shared/Layout";
import { defaultCurrentUser } from "../data";
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
} from "@material-ui/core";
import ProfilePicture from "../components/shared/ProfilePicture";
import { Link } from "react-router-dom";
import { GearIcon } from "../icons";

function ProfilePage() {
  const isOwner = true;
  const classes = useProfilePageStyles();
  const [showOptions, setOptions] = useState(false);

  function handleMenuOptions() {
    setOptions(true);
  }
  function handleMenuOptionsOnClose() {
    setOptions(false);
  }

  return (
    <Layout
      title={`${defaultCurrentUser.name} (@${defaultCurrentUser.username})`}
    >
      <div className={classes.container}>
        <Hidden xsDown>
          <Card className={classes.cardLarge}>
            <ProfilePicture isOwner={isOwner} />
            <CardContent className={classes.cardContentLarge}>
              <ProfileNameSection
                user={defaultCurrentUser}
                isOwner={isOwner}
                handleMenuOptions={handleMenuOptions}
              />
              <PostCountSection />
              <NameBioSection />
            </CardContent>
          </Card>
        </Hidden>
        <Hidden smUp>
          <Card className={classes.cardSmall}>
            <CardContent>
              <section className={classes.sectionSmall}>
                <ProfilePicture isOwner={isOwner} size={75} />
                <ProfileNameSection
                  user={defaultCurrentUser}
                  isOwner={isOwner}
                  handleMenuOptions={handleMenuOptions}
                />
              </section>
              <NameBioSection />
            </CardContent>
            <PostCountSection />
          </Card>
        </Hidden>
        {showOptions && (
          <OptionsMenu handleMenuOptionsOnClose={handleMenuOptionsOnClose} />
        )}
      </div>
    </Layout>
  );
}
function ProfileNameSection({ user, isOwner, handleMenuOptions }) {
  const classes = useProfilePageStyles();
  let followBtn;
  const [isFollowing] = useState(false);
  const [isFollower] = useState(false);
  if (isFollowing) {
    followBtn = (
      <Button variant="outlined" className={classes.button}>
        Following
      </Button>
    );
  } else if (isFollower) {
    followBtn = (
      <Button variant="contained" color="primary" className={classes.button}>
        Follow Back
      </Button>
    );
  } else {
    followBtn = (
      <Button variant="contained" color="primary" className={classes.button}>
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
    </>
  );
}

function PostCountSection() {
  const classes = useProfilePageStyles();

  return <div>123</div>;
}
function NameBioSection() {
  const classes = useProfilePageStyles();

  return <div>123</div>;
}
function OptionsMenu({ handleMenuOptionsOnClose }) {
  const classes = useProfilePageStyles();
  const [showLogOut, setLogOut] = useState(false);

  function handlerLogOutShow() {
    setLogOut(true);
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
