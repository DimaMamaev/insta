import React, { useState } from "react";
import { useNavbarStyles } from "../../styles";
import { AppBar, Hidden, InputBase, Avatar } from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";
import logo from "../../images/logo.png";
import {
  LoadingIcon,
  AddIcon,
  LikeIcon,
  LikeActiveIcon,
  ExploreIcon,
  ExploreActiveIcon,
  HomeIcon,
  HomeActiveIcon,
} from "../../icons";
import { defaultCurrentUser } from "../../data";

function Navbar({ minimal }) {
  const classes = useNavbarStyles();
  const history = useHistory();
  const path = history.location.pathname;

  return (
    <AppBar className={classes.appBar}>
      <section className={classes.section}>
        <Logo />
        {!minimal && <Search />}
        {!minimal && <Links path={path} />}
      </section>
    </AppBar>
  );
}
function Search() {
  const classes = useNavbarStyles();
  const [text, setText] = useState("");
  let loading = false;

  function handleClearInput() {
    setText(" ");
  }

  return (
    <Hidden only="xs">
      <InputBase
        onChange={(event) => setText(event.target.value)}
        className={classes.input}
        startAdornment={<span className={classes.searchIcon} />}
        endAdornment={
          loading ? (
            <LoadingIcon />
          ) : (
            <span className={classes.clearIcon} onClick={handleClearInput} />
          )
        }
        placeholder="Search"
        value={text}
      />
    </Hidden>
  );
}
function Links({ path }) {
  const classes = useNavbarStyles();
  const [showList, setList] = useState(false);

  return (
    <div className={classes.linksContainer}>
      <div className={classes.linksWrapper}>
        <Hidden xsDown>
          <AddIcon />
        </Hidden>
        <Link to="/">{path === "/" ? <HomeActiveIcon /> : <HomeIcon />}</Link>
        <Link to="/explore">
          {path === "/explore" ? <ExploreActiveIcon /> : <ExploreIcon />}
        </Link>
        <div className={classes.notifications}>
          {showList ? <LikeActiveIcon /> : <LikeIcon />}
        </div>
        <Link to={`/${defaultCurrentUser.username}`}>
          <div
            className={
              path === `/${defaultCurrentUser.username}`
                ? classes.profileActive
                : ""
            }
          >
            <Avatar
              src={defaultCurrentUser.profile_image}
              className={classes.profileImage}
            />
          </div>
        </Link>
      </div>
    </div>
  );
}

function Logo() {
  const classes = useNavbarStyles();
  return (
    <div className={classes.logoContainer}>
      <Link to="/">
        <div className={classes.logoWrapper}>
          <img src={logo} alt="Insta logo" className={classes.logo} />
        </div>
      </Link>
    </div>
  );
}

export default Navbar;
