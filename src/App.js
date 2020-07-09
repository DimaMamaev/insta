import React, { useRef, useEffect, useContext, createContext } from "react";
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
import { useSubscription } from "@apollo/react-hooks";
import { CURRENT_USER_DATA } from "./graphql/subscriptions";
import LoadingScreen from "./components/shared/LoadingScreen";

export const UserContext = createContext();

function App() {
  const history = useHistory();
  const { authState } = useContext(AuthContext);
  const isAuth = authState.status === "in";
  const userId = isAuth ? authState.user.uid : null;
  const variables = { userId };
  const { data, loading } = useSubscription(CURRENT_USER_DATA, { variables });
  const location = useLocation();
  const prevLocation = useRef(location);
  const modal = location.state?.modal;
  useEffect(() => {
    if (!history.action !== "POP" && !modal) {
      prevLocation.current = location;
    }
  }, [location, modal, history.action]);

  if (loading) return <LoadingScreen />;
  if (!isAuth) {
    return (
      <Switch>
        <Route path="/accounts/login" component={LoginPage} />
        <Route path="/accounts/emailsignup" component={SignUpPage} />
        <Redirect to="/accounts/login" />
      </Switch>
    );
  }
  const isModalOpen = modal && prevLocation.current !== location;
  const currentUser = isAuth && data ? data.users[0] : null;
  const currentUserId = currentUser.id;
  const followingUsers = currentUser.following.map(({ user }) => user.id);
  const followersUsers = currentUser.followers.map(({ user }) => user.id);
  const feedUsers = [...followingUsers, currentUserId];
  return (
    <UserContext.Provider
      value={{
        currentUser,
        currentUserId,
        followersUsers,
        followingUsers,
        feedUsers,
      }}
    >
      <Switch location={isModalOpen ? prevLocation.current : location}>
        <Route path="/" exact component={FeedPage} />
        <Route path="/insta" exact component={FeedPage} />
        <Route path="/explore" component={ExplorePage} />
        <Route exact path="/:username" component={ProfilePage} />
        <Route exact path="/p/:postId" component={PostPage} />
        <Route path="/accounts/edit" component={EditProfilePage} />
        <Route path="/accounts/login" component={LoginPage} />
        <Route path="/accounts/emailsignup" component={SignUpPage} />
        <Route path="*" component={NotFoundPage} />
      </Switch>
      {isModalOpen && <Route exact path="/p/:postId" component={PostModal} />}
    </UserContext.Provider>
  );
}

export default App;
