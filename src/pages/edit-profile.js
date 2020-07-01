import React, { useContext } from "react";
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
  TextField,
  Button,
} from "@material-ui/core";
import { Menu } from "@material-ui/icons";
import ProfilePicture from "../components/shared/ProfilePicture";
import { UserContext } from "../App";
import { useQuery } from "@apollo/react-hooks";
import { GET_EDIT_USER_PROFILE } from "../graphql/queries";
import LoadingScreen from "../components/shared/LoadingScreen";

function EditProfilePage({ history }) {
  const classes = useEditProfilePageStyles();
  const { currentUserId } = useContext(UserContext);

  const variables = { id: currentUserId };
  const { data, loading } = useQuery(GET_EDIT_USER_PROFILE, { variables });

  const path = history.location.pathname;
  const [showTabMenu, setTabMenu] = useState(false);

  if (loading) return <LoadingScreen />;

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
          {path.includes("edit") && <EditUserInfo user={data.users_by_pk} />}
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
        <ProfilePicture size={50} image={user.profile_image} />
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
      <form className={classes.form}>
        <SectionItem text="Name" formItem={user.name} />
        <SectionItem text="Username" formItem={user.username} />
        <SectionItem text="Website" formItem={user.website} />
        <div className={classes.sectionItem}>
          <aside>
            <Typography className={classes.bio}>Bio </Typography>
          </aside>
          <TextField
            variant="outlined"
            fullWidth
            multiline
            rowsMax={3}
            rows={3}
            value={user.bio}
          />
        </div>
        <div className={classes.sectionItem}>
          <div />
          <Typography
            color="textSecondary"
            className={classes.justifySelfStart}
          >
            Personal Information
          </Typography>
        </div>
        <SectionItem text="Email" formItem={user.email} type="email" />
        <SectionItem text="Phone Number" formItem={user.phone_number} />
        <div className={classes.sectionItem}>
          <div />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={classes.justifySelfStart}
          >
            Submit
          </Button>
        </div>
      </form>
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
        <Hidden smUp>
          <Typography className={classes.typography}>{text}</Typography>
        </Hidden>
      </aside>
      <TextField
        variant="outlined"
        fullWidth
        value={formItem}
        type={type}
        inputProps={{ className: classes.textFieldInput }}
        className={classes.textField}
      />
    </div>
  );
}

export default EditProfilePage;
