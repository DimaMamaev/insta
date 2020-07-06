import React, { useState, useRef, useContext } from "react";
import { useProfilePictureStyles } from "../../styles";
import { Person } from "@material-ui/icons";
import { useMutation } from "@apollo/react-hooks";
import { UPDATE_USER_PROFILE_AVATAR } from "../../graphql/mutations";
import handleImageUpload from "../../utils/handleImageUpload";
import { UserContext } from "../../App";

function ProfilePicture({ size, image, isOwner }) {
  const classes = useProfilePictureStyles({ size, isOwner });
  const { currentUserId } = useContext(UserContext);
  const [profileImage, setProfileImage] = useState(image);
  const inputRef = useRef();
  const [editUserAvatar] = useMutation(UPDATE_USER_PROFILE_AVATAR);

  function openFileInput() {
    inputRef.current.click();
  }
  async function handlePicUpdate(event) {
    const url = await handleImageUpload(event.target.files[0]);
    const variables = { id: currentUserId, profileImage: url };
    await editUserAvatar({ variables });
    setProfileImage(url);
  }

  return (
    <section className={classes.section}>
      <input
        style={{ display: "none" }}
        type="file"
        ref={inputRef}
        onChange={handlePicUpdate}
      />
      {image ? (
        <div
          className={classes.wrapper}
          onClick={isOwner ? openFileInput : () => null}
        >
          <img src={profileImage} alt="User avatar" className={classes.image} />
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
