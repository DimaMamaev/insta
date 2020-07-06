import React from "react";
import { useProfileTabsStyles } from "../../styles";
import { Hidden, Divider, Tabs, Tab, Typography } from "@material-ui/core";
import { useState } from "react";
import { GridIcon, SaveIcon } from "../../icons";
import GridPost from "../shared/GridPost";

function ProfileTabs({ user, isOwner }) {
  const classes = useProfileTabsStyles();
  const [tabValue, setTabValue] = useState(0);

  return (
    <>
      <section className={classes.section}>
        <Hidden xsDown>
          <Divider />
        </Hidden>
        <Hidden xsDown>
          <Tabs
            value={tabValue}
            onChange={(_, value) => setTabValue(value)}
            centered
            classes={{
              indicator: classes.tabIndicator,
            }}
          >
            <Tab
              icon={<span className={classes.postsIconLarge} />}
              label="POSTS"
              classes={{
                root: classes.tabRoot,
                labelIcon: classes.tabLabelIcon,
                wrapper: classes.tabWrapper,
              }}
            />
            {isOwner && (
              <Tab
                icon={<span className={classes.savedIconLarge} />}
                label="SAVED"
                classes={{
                  root: classes.tabRoot,
                  labelIcon: classes.tabLabelIcon,
                  wrapper: classes.tabWrapper,
                }}
              />
            )}
          </Tabs>
        </Hidden>
        <Hidden smUp>
          <Tabs
            value={tabValue}
            onChange={(_, value) => setTabValue(value)}
            centered
            className={classes.tabs}
            classes={{
              indicator: classes.tabIndicator,
            }}
          >
            <Tab
              icon={<GridIcon fill={tabValue === 0 ? "#3897f0" : undefined} />}
              classes={{ root: classes.tabRoot }}
            />
            {isOwner && (
              <Tab
                icon={
                  <SaveIcon fill={tabValue === 1 ? "#3897f0" : undefined} />
                }
                classes={{ root: classes.tabRoot }}
              />
            )}
          </Tabs>
        </Hidden>
        <Hidden smUp>
          {user.posts_aggregate.aggregate.count === 0 && <Divider />}
        </Hidden>
        {tabValue === 0 && <ProfilePosts user={user} isOwner={isOwner} />}
        {tabValue === 1 && <SavedPosts user={user} />}
      </section>
    </>
  );
}

function ProfilePosts({ user, isOwner }) {
  const classes = useProfileTabsStyles();

  if (user.posts_aggregate.aggregate.count === 0) {
    return (
      <section className={classes.profilePostsSection}>
        <div className={classes.noContent}>
          <div className={classes.uploadPhotoIcon} />
          <Typography variant="h4">
            {isOwner ? "Upload some photos" : "No posts"}
          </Typography>
        </div>
      </section>
    );
  }

  return (
    <article className={classes.article}>
      <div className={classes.postContainer}>
        {user.posts.map((post) => (
          <GridPost key={post.id} post={post} />
        ))}
      </div>
    </article>
  );
}

function SavedPosts({ user }) {
  const classes = useProfileTabsStyles();
  if (user.saved_posts.length === 0) {
    return (
      <section className={classes.savedPostsSection}>
        <div className={classes.noContent}>
          <div className={classes.savePhotoIcon} />
          <Typography variant="h4">Save</Typography>
          <Typography align="center">
            Save photos and videos that you want to see again. No one is
            notified, and only you can see what you've saved.
          </Typography>
        </div>
      </section>
    );
  }
  return (
    <article className={classes.article}>
      <div className={classes.postContainer}>
        {user.saved_posts.map(({ posts }) => (
          <GridPost key={posts.id} post={posts} />
        ))}
      </div>
    </article>
  );
}

export default ProfileTabs;
