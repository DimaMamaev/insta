import React from "react";
import { useEditProfilePageStyles } from "../styles";
import Layout from "../components/shared/Layout";
import { useState } from "react";
import { IconButton, Hidden, Drawer, List } from "@material-ui/core";
import { Menu } from "@material-ui/icons";

function EditProfilePage() {
  const classes = useEditProfilePageStyles();
  const [showTabMenu, setTabMenu] = useState(false);

  function handlerToggleTabMenu() {
    setTabMenu((prev) => !prev);
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
  const drawer = <List></List>;

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
            ></Drawer>
          </Hidden>
        </nav>
      </section>
    </Layout>
  );
}

export default EditProfilePage;
