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
  Snackbar,
  Slide,
} from "@material-ui/core";
import { Menu } from "@material-ui/icons";
import ProfilePicture from "../components/shared/ProfilePicture";
import { UserContext } from "../App";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { GET_EDIT_USER_PROFILE } from "../graphql/queries";
import LoadingScreen from "../components/shared/LoadingScreen";
import { useForm } from "react-hook-form";
import isURL from "validator/lib/isURL";
import isEmail from "validator/lib/isEmail";
import isMobilePhone from "validator/lib/isMobilePhone";
import {
  UPDATE_USER_PROFILE_DATA,
  UPDATE_USER_PROFILE_AVATAR,
} from "../graphql/mutations";
import { AuthContext } from "../auth";
import handleImageUpload from "../utils/handleImageUpload";

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
  const { register, handleSubmit } = useForm({ mode: "onBlur" });
  const [editUser] = useMutation(UPDATE_USER_PROFILE_DATA);
  const [editUserAvatar] = useMutation(UPDATE_USER_PROFILE_AVATAR);
  const [profileImage, setProfileImage] = useState(user.profile_image);
  const { updateEmail } = useContext(AuthContext);
  const [error, setError] = useState({ type: "", message: "" });
  const [updateMessage, setUpdateMessage] = useState(false);

  async function onSubmit(data) {
    try {
      setError({ type: "", message: "" });
      const variables = { ...data, id: user.id };
      await updateEmail(data.email);
      await editUser({ variables });
      setUpdateMessage(true);
    } catch (error) {
      console.log(error);

      handleErrorMessage(error);
    }
  }
  function handleErrorMessage(error) {
    if (error.message.includes("users_username_key")) {
      setError({ type: "username", message: "Username is already taken " });
    } else if (error.code.includes("auth")) {
      setError({ type: "email", message: error.message });
    }
  }

  async function handlePicUpdate(event) {
    const url = await handleImageUpload(event.target.files[0]);
    const variables = { id: user.id, profileImage: url };
    await editUserAvatar({ variables });
    setProfileImage(url);
  }

  return (
    <section className={classes.container}>
      <div className={classes.pictureSectionItem}>
        <ProfilePicture size={50} image={profileImage} />
        <div className={classes.justifySelfStart}>
          <Typography className={classes.typography}>
            {user.username}
          </Typography>
          <input
            accept="image/*"
            id="image"
            type="file"
            style={{ display: "none" }}
            onChange={handlePicUpdate}
          />
          <label htmlFor="image">
            <Typography
              className={classes.typographyChangePic}
              color="primary"
              variant="body2"
            >
              Change Profile Photo
            </Typography>
          </label>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
        <SectionItem
          name="name"
          inputRef={register({
            required: true,
            minLength: 3,
            maxLength: 20,
          })}
          text="Name"
          formItem={user.name}
        />
        <SectionItem
          name="username"
          error={error}
          inputRef={register({
            required: true,
            pattern: /^[A-Za-z0-9_.]*$/,
            minLength: 3,
            maxLength: 20,
          })}
          text="Username"
          formItem={user.username}
        />
        <SectionItem
          name="website"
          inputRef={register({
            validate: (input) =>
              Boolean(input)
                ? isURL(input, {
                    protocols: ["http", "https"],
                    require_protocol: true,
                  })
                : true,
          })}
          text="Website"
          formItem={user.website}
        />
        <div className={classes.sectionItem}>
          <aside>
            <Typography className={classes.bio}>Bio </Typography>
          </aside>
          <TextField
            name="bio"
            inputRef={register({
              maxLength: 150,
            })}
            variant="outlined"
            fullWidth
            multiline
            rowsMax={3}
            rows={3}
            defaultValue={user.bio}
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
        <SectionItem
          error={error}
          name="email"
          inputRef={register({
            required: true,
            validate: (input) => isEmail(input),
          })}
          text="Email"
          formItem={user.email}
          type="email"
        />
        <SectionItem
          name="phoneNumber"
          inputRef={register({
            validate: (input) => (Boolean(input) ? isMobilePhone(input) : true),
          })}
          text="Phone Number"
          formItem={user.phone_number}
        />
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
      <Snackbar
        open={updateMessage}
        message={<span>Profile updated!</span>}
        autoHideDuration={6000}
        TransitionComponent={Slide}
        onClose={() => setUpdateMessage(false)}
      />
    </section>
  );
}

function SectionItem({ type = "text", text, formItem, inputRef, name, error }) {
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
        helperText={error?.type === name && error.message}
        name={name}
        inputRef={inputRef}
        variant="outlined"
        fullWidth
        defaultValue={formItem}
        type={type}
        inputProps={{ className: classes.textFieldInput }}
        className={classes.textField}
      />
    </div>
  );
}

export default EditProfilePage;
