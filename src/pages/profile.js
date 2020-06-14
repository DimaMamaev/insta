import React from "react";
import { useProfilePageStyles } from "../styles";
import Layout from "../components/shared/Layout";
import { defaultCurrentUser } from "../data";
import { Hidden, Card, CardContent } from "@material-ui/core";
import ProfilePicture from "../components/shared/ProfilePicture";

function ProfilePage() {
  const classes = useProfilePageStyles();

  return (
    <Layout
      title={`${defaultCurrentUser.name} (@${defaultCurrentUser.username})`}
    >
      <div className={classes.container}>
        <Hidden xsDown>
          <Card className={classes.cardLarge}>
            <ProfilePicture />
            <CardContent className={classes.cardContentLarge}>
              <ProfileNameSection />
              <PostCountSection />
              <NameBioSection />
            </CardContent>
          </Card>
        </Hidden>
        <Hidden smUp>
          <Card className={classes.cardSmall}>
            <CardContent>
              <section className={classes.sectionSmall}>
                <ProfilePicture />
                <ProfileNameSection />
              </section>
              <NameBioSection />
            </CardContent>
            <PostCountSection />
          </Card>
        </Hidden>
      </div>
    </Layout>
  );
}
function ProfileNameSection() {
  return <div>123</div>;
}
function PostCountSection() {
  return <div>123</div>;
}
function NameBioSection() {
  return <div>123</div>;
}

export default ProfilePage;
