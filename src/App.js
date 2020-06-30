import React, { useRef, useEffect, useContext } from "react";
import {
  Switch,
  Route,
  useHistory,
  useLocation,
  Redirect,
} from "react-router-dom";
import FeedPage from "./pages/feed";
import ExplorePage from "./pages/explore";
import EditProfilePage from "./pages/edit-profile";
import SignUpPage from "./pages/signup";
import ProfilePage from "./pages/profile";
import PostPage from "./pages/post";
import LoginPage from "./pages/login";
import NotFoundPage from "./pages/not-found";
import PostModal from "./components/post/PostModal";
import { AuthContext } from "./auth";

function App() {
  const history = useHistory();
  const { authState } = useContext(AuthContext);
  const isAuth = authState.status === "in";
  console.log(Boolean(isAuth));
  const location = useLocation();
  const prevLocation = useRef(location);
  const modal = location.state?.modal;
  useEffect(() => {
    if (!history.action !== "POP" && !modal) {
      prevLocation.current = location;
    }
  }, [location, modal, history.action]);

  const isModalOpen = modal && prevLocation.current !== location;
  if (!isAuth) {
    return (
      <Switch>
        <Route path="/accounts/login" component={LoginPage} />
        <Route path="/accounts/emailsignup" component={SignUpPage} />
        <Redirect to="/accounts/login" />
      </Switch>
    );
  }
  return (
    <>
      <Switch location={isModalOpen ? prevLocation.current : location}>
        <Route path="/" exact component={FeedPage} />
        <Route path="/explore" component={ExplorePage} />
        <Route exact path="/:username" component={ProfilePage} />
        <Route exact path="/p/:postId" component={PostPage} />
        <Route path="/accounts/edit" component={EditProfilePage} />
        <Route path="/accounts/login" component={LoginPage} />
        <Route path="/accounts/emailsignup" component={SignUpPage} />
        <Route path="*" component={NotFoundPage} />
      </Switch>
      {isModalOpen && <Route exact path="/p/:postId" component={PostModal} />}
    </>
  );
}

export default App;