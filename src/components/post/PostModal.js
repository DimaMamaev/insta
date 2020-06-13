import React from "react";
import { usePostModalStyles } from "../../styles";
import Modal from "react-modal";
import Post from "./Post";
import { useParams, useHistory } from "react-router-dom";
import { CloseIcon } from "../../icons";

function PostModal() {
  const classes = usePostModalStyles();
  const history = useHistory();
  const { postId } = useParams();

  return (
    <>
      <Modal
        isOpen
        overlayClassName={classes.overlay}
        ariaHideApp={false}
        onRequestClose={() => history.goBack()}
        style={{
          content: {
            display: "flex",
            alignItems: "center",
            maxWidth: 935,
            width: "100%",
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            transform: "translate(-50%, -50%)",
            margin: 0,
            padding: 0,
            overflow: "none",
            WebkitOverflowScrolling: "touch",
          },
        }}
      >
        <Post id={postId} />
      </Modal>
      <div onClick={() => history.goBack()} className={classes.close}>
        <CloseIcon />
      </div>
    </>
  );
}

export default PostModal;
