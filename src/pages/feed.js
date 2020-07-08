import React, { useState, useContext, useEffect } from "react";
import { useFeedPageStyles } from "../styles";
import Layout from "../components/shared/Layout";
import UserCard from "../components/shared/UserCard";
import FeedSideSuggestions from "../components/feed/FeedSideSuggestions";
import { Hidden } from "@material-ui/core";
import LoadingScreen from "../components/shared/LoadingScreen";
import { LoadingLargeIcon } from "../icons";
import FeedPostSkeleton from "../components/feed/FeedPostSkeleton";
import { UserContext } from "../App";
import { useQuery } from "@apollo/react-hooks";
import { GET_FEED } from "../graphql/queries";
import usePageBottom from "../utils/usePageBottom";
const FeedPost = React.lazy(() => import("../components/feed/FeedPost"));

function FeedPage() {
  const classes = useFeedPageStyles();
  const { currentUser, feedUsers } = useContext(UserContext);
  const [isEndOfFeedList, setEndOfFeedList] = useState(false);
  const variables = { feedIds: feedUsers, limit: 2 };
  const { data, loading, fetchMore } = useQuery(GET_FEED, { variables });
  const isPageBottom = usePageBottom();
  function handleUpdateQuery(prev, { fetchMoreResult }) {
    if (fetchMoreResult.posts.length === 0) {
      setEndOfFeedList(true);
      return prev;
    }
    return { posts: [...prev.posts, ...fetchMoreResult.posts] };
  }
  useEffect(() => {
    if (!isPageBottom || !data) return;
    const lastTimestamp = data.posts[data.posts.length - 1].created_at;
    const updatedVariables = { ...variables, lastTimestamp };
    fetchMore({ variables: updatedVariables, updateQuery: handleUpdateQuery });
  }, [isPageBottom, data, variables, handleUpdateQuery, fetchMore]);

  if (loading) return <LoadingScreen />;

  return (
    <Layout>
      <section className={classes.container}>
        <div>
          {data.posts.map((post, index) => (
            <React.Suspense key={post.id} fallback={<FeedPostSkeleton />}>
              <FeedPost index={index} post={post} />
            </React.Suspense>
          ))}
        </div>
        <Hidden smDown>
          <div className={classes.sidebarContainer}>
            <div className={classes.sidebarWrapper}>
              <UserCard user={currentUser} avatarSize={50} />
              <FeedSideSuggestions />
            </div>
          </div>
        </Hidden>
        {!isEndOfFeedList && <LoadingLargeIcon />}
      </section>
    </Layout>
  );
}

export default FeedPage;
