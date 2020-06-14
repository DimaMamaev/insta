import React from "react";
import { useProfilePictureStyles } from "../../styles";
import { defaultCurrentUser } from "../../data";
import { Person } from "@material-ui/icons";

function ProfilePicture({
  size,
  image = defaultCurrentUser.profile_image,
  isOwner,
}) {
  const classes = useProfilePictureStyles({ size, isOwner });

  return (
    <section className={classes.section}>
      {image ? (
        <div className={classes.wrapper}>
          <img src={image} alt="User avatar" className={classes.image} />
        </div>
      ) : (
        <div className={classes.wrapper}>
          <Person className={classes.person} />
        </div>
      )}
    </section>
  );
}

export default ProfilePicture;
