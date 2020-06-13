import React, { useState, useEffect } from "react";
import { useNavbarStyles, WhiteTooltip, RedTooltip } from "../../styles";
import {
  AppBar,
  Hidden,
  InputBase,
  Avatar,
  Grid,
  Typography,
  Fade,
  Zoom,
} from "@material-ui/core";
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
import { defaultCurrentUser, getDefaultUser } from "../../data";
import NotificationTooltip from "../notification/NotificationTooltip";
import NotificationList from "../notification/NotificationList";
import { useNProgress } from "@tanem/react-nprogress";

function Navbar({ minimal }) {
  const classes = useNavbarStyles();
  const history = useHistory();
  const path = history.location.pathname;
  const [isPageLoading, setPageLoading] = useState(true);
  useEffect(() => {
    setPageLoading(false);
  }, [path]);

  return (
    <>
      <Progress isAnimating={isPageLoading} />
      <AppBar className={classes.appBar}>
        <section className={classes.section}>
          <Logo />
          {!minimal && <Search history={history} />}
          {!minimal && <Links path={path} />}
        </section>
      </AppBar>
    </>
  );
}
function Search({ history }) {
  const classes = useNavbarStyles();
  const [text, setText] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const resultCheck = Boolean(text) && text.length > 0;

  useEffect(() => {
    if (!text.trim()) return;
    setResults(Array.from({ length: 5 }, () => getDefaultUser()));
  }, [text]);

  function handleClearInput() {
    setText("");
  }

  return (
    <Hidden only="xs">
      <WhiteTooltip
        arrow
        interactive
        TransitionComponent={Fade}
        open={resultCheck}
        title={
          resultCheck && (
            <Grid className={classes.resultContainer} container>
              {results.map((result) => (
                <Grid
                  key={result.id}
                  item
                  className={classes.resultLink}
                  onClick={() => {
                    history.push(`/${result.username}`);

                    handleClearInput();
                  }}
                >
                  <div className={classes.resultWrapper}>
                    <div className={classes.avatarWrapper}>
                      <Avatar src={result.profile_image} alt="User avatar" />
                    </div>
                    <div className={classes.nameWrapper}>
                      <Typography variant="body1">{result.username}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {result.name}
                      </Typography>
                    </div>
                  </div>
                </Grid>
              ))}
            </Grid>
          )
        }
      >
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
      </WhiteTooltip>
    </Hidden>
  );
}
function Links({ path }) {
  const classes = useNavbarStyles();
  const [showList, setList] = useState(false);
  const [showToolTip, setToolTip] = useState(true);
  useEffect(() => {
    const timeout = setTimeout(handleHideToolTip, 5000);
    return () => {
      clearTimeout(timeout);
    };
  }, []);
  function handleToggleList() {
    setList((prev) => !prev);
  }
  function handleHideToolTip() {
    setToolTip(false);
  }
  function handleHideList() {
    setList(false);
  }
  return (
    <div className={classes.linksContainer}>
      {showList && <NotificationList handleHideList={handleHideList} />}
      <div className={classes.linksWrapper}>
        <Hidden xsDown>
          <AddIcon />
        </Hidden>
        <Link to="/">{path === "/" ? <HomeActiveIcon /> : <HomeIcon />}</Link>
        <Link to="/explore">
          {path === "/explore" ? <ExploreActiveIcon /> : <ExploreIcon />}
        </Link>
        <RedTooltip
          arrow
          open={showToolTip}
          onOpen={handleHideToolTip}
          TransitionComponent={Zoom}
          title={<NotificationTooltip />}
        >
          <div className={classes.notifications} onClick={handleToggleList}>
            {showList ? <LikeActiveIcon /> : <LikeIcon />}
          </div>
        </RedTooltip>
        <Link to={`/${defaultCurrentUser.username}`}>
          <div
            className={
              path === `/${defaultCurrentUser.username}`
                ? classes.profileActive
                : " "
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
function Progress({ isAnimating }) {
  const classes = useNavbarStyles();
  const { animationDuration, progress, isFinished } = useNProgress({
    isAnimating,
  });

  return (
    <div
      className={classes.progressContainer}
      style={{
        opacity: isFinished ? 0 : 1,
        transition: `opacity ${animationDuration}ms linear`,
      }}
    >
      <div
        className={classes.progressBar}
        style={{
          marginLeft: `${(-1 + progress) * 100}%`,
          transition: `margin-left ${animationDuration}ms linear`,
        }}
      >
        <div className={classes.progressBackground} />
      </div>
    </div>
  );
}

export default Navbar;
