import React from "react";
import { useEditProfilePageStyles } from "../styles";
import Layout from "../components/shared/Layout";
import { useState } from "react";
import {
  IconButton,
  Hidden,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@material-ui/core";
import { Menu } from "@material-ui/icons";
import { defaultCurrentUser } from "../data";
import ProfilePicture from "../components/shared/ProfilePicture";

function EditProfilePage({ history }) {
  const classes = useEditProfilePageStyles();
  const path = history.location.pathname;
  const [showTabMenu, setTabMenu] = useState(false);

  function handlerToggleTabMenu() {
    setTabMenu((prev) => !prev);
  }
  function handleToggleDrawer(index) {
    switch (index) {
      case 0:
        return path.includes("edit");
      default:
        break;
    }
  }
  function handleListClick(index) {
    switch (index) {
      case 0:
        history.push("/accounts/edit");
        break;

      default:
        break;
    }
  }
  const options = [
    "Edith Profile",
    "Change Password",
    "Apps and Websites",
    "Email and SMS",
    "Push Notifications",
    "Manage Contacts",
    "Privacy and Security",
    "Login activity",
    "Emails from Instagram",
  ];
  const drawer = (
    <List>
      {options.map((option, index) => (
        <ListItem
          key={option}
          button
          selected={handleToggleDrawer(index)}
          onClick={() => handleListClick(index)}
          classes={{
            selected: classes.listItemSelected,
            button: classes.listItemButton,
          }}
        >
          <ListItemText primary={option} />
        </ListItem>
      ))}
    </List>
  );

  return (
    <Layout title="Edit Profile">
      <section className={classes.section}>
        <IconButton
          edge="start"
          className={classes.menuButton}
          onClick={handlerToggleTabMenu}
        >
          <Menu />
        </IconButton>
        <nav>
          <Hidden smUp implementation="css">
            <Drawer
              variant="temporary"
              anchor="left"
              open={showTabMenu}
              onClose={handlerToggleTabMenu}
              classes={{ paperAnchorLeft: classes.temporaryDrawer }}
            >
              {drawer}
            </Drawer>
          </Hidden>
          <Hidden
            sxsDown
            implementation="css"
            className={classes.permanentDrawerRoot}
          >
            <Drawer
              variant="permanent"
              open
              onClose={handlerToggleTabMenu}
              classes={{
                paper: classes.permanentDrawerPaper,
                root: classes.permanentDrawerRoot,
              }}
            >
              {drawer}
            </Drawer>
          </Hidden>
        </nav>
        <main>
          {path.includes("edit") && <EditUserInfo user={defaultCurrentUser} />}
        </main>
      </section>
    </Layout>
  );
}

function EditUserInfo({ user }) {
  const classes = useEditProfilePageStyles();

  return (
    <section className={classes.container}>
      <div className={classes.pictureSectionItem}>
        <ProfilePicture size={50} user={user} />
        <div className={classes.justifySelfStart}>
          <Typography className={classes.typography}>
            {user.username}
          </Typography>
          <Typography
            className={classes.typographyChangePic}
            color="primary"
            variant="body2"
          >
            Change Profile Photo
          </Typography>
        </div>
      </div>
      <form className={classes.form}></form>
    </section>
  );
}

function SectionItem({ type = "text", text, formItem }) {
  const classes = useEditProfilePageStyles();

  return (
    <div className={classes.sectionItemWrapper}>
      <aside>
        <Hidden xsDown>
          <Typography className={classes.typography} align="right">
            {text}
          </Typography>
        </Hidden>
      </aside>
    </div>
  );
}

export default EditProfilePage;
