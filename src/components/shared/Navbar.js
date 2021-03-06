import React, { useState, useEffect, useContext, useRef } from "react";
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
import NotificationTooltip from "../notification/NotificationTooltip";
import NotificationList from "../notification/NotificationList";
import { useNProgress } from "@tanem/react-nprogress";
import { SEARCH_USERS } from "../../graphql/queries";
import { useLazyQuery } from "@apollo/react-hooks";
import { UserContext } from "../../App";
import AddPostDialog from "../post/AddPostDialog";
import { isAfter } from "date-fns";

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
  const [searchUsers, { data }] = useLazyQuery(SEARCH_USERS);

  const resultCheck = Boolean(text) && text.length > 0;

  useEffect(() => {
    if (!text.trim()) return;
    setLoading(true);
    const variables = { query: `%${text}%` };
    searchUsers({ variables });
    if (data) {
      setResults(data.users);
      setLoading(false);
    }
  }, [text, data, searchUsers]);

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
  const { currentUser, currentUserId } = useContext(UserContext);
  const newNotifications = currentUser.notifications.filter(
    ({ created_at }) => {
      return isAfter(new Date(created_at), new Date(currentUser.last_checked));
    }
  );
  const hasSomeNotifications = newNotifications.length > 0;
  const classes = useNavbarStyles();
  const [showList, setList] = useState(false);
  const [showToolTip, setToolTip] = useState(hasSomeNotifications);
  const [media, setMedia] = useState(null);
  const [showPostDialog, setAddPostDialog] = useState(false);
  const inputRef = useRef();
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
  function openFileInput() {
    inputRef.current.click();
  }
  function handleAddPost(event) {
    setMedia(event.target.files[0]);
    setAddPostDialog(true);
  }
  function handleClose() {
    setAddPostDialog(false);
  }
  return (
    <div className={classes.linksContainer}>
      {showList && (
        <NotificationList
          notifications={currentUser.notifications}
          handleHideList={handleHideList}
          currentUserId={currentUserId}
        />
      )}
      <div className={classes.linksWrapper}>
        {showPostDialog && (
          <AddPostDialog media={media} handleClose={handleClose} />
        )}
        <Hidden xsDown>
          <input
            type="file"
            style={{ display: "none" }}
            ref={inputRef}
            onChange={handleAddPost}
          />
          <AddIcon onClick={openFileInput} />
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
          title={<NotificationTooltip notifications={newNotifications} />}
        >
          <div
            className={hasSomeNotifications ? classes.notifications : ""}
            onClick={handleToggleList}
          >
            {showList ? <LikeActiveIcon /> : <LikeIcon />}
          </div>
        </RedTooltip>
        <Link to={`/${currentUser.username}`}>
          <div
            className={
              path === `/${currentUser.username}` ? classes.profileActive : " "
            }
          >
            <Avatar
              src={currentUser.profile_image}
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
