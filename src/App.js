import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import FeedPage from "./pages/feed";
import ExplorePage from "./pages/explore";
import EditProfilePage from "./pages/edit-profile";
import SignUpPage from "./pages/signup";
import ProfilePage from "./pages/profile";
import PostPage from "./pages/post";
import LoginPage from "./pages/login";
import NotFoundPage from "./pages/not-found";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={FeedPage} />
        <Route path="/explore" component={ExplorePage} />
        <Route exact path="/:username" component={ProfilePage} />
        <Route exact path="/p/:postId" component={PostPage} />
        <Route path="/accounts/edit" component={EditProfilePage} />
        <Route path="/accounts/login" component={LoginPage} />
        <Route path="/accounts/emailsignup" component={SignUpPage} />
        <Route path="*" component={NotFoundPage} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
