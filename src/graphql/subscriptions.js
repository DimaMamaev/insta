import { gql } from "apollo-boost";

export const CURRENT_USER_DATA = gql`
  subscription CurrentUserData($userId: String) {
    users(where: { user_id: { _eq: $userId } }) {
      id
      user_id
      last_checked
      name
      username
      created_at
      profile_image
      followers {
        user {
          id
          user_id
        }
      }
      following {
        user {
          id
          user_id
        }
      }
      notifications(order_by: { created_at: desc }) {
        id
        type
        created_at
        post {
          id
          media
        }
        user {
          id
          username
          profile_image
        }
      }
    }
  }
`;
export const GET_POST = gql`
  subscription getPost($postId: uuid!) {
    posts_by_pk(id: $postId) {
      id
      caption
      created_at
      media
      location
      user {
        id
        username
        name
        profile_image
      }
      likes_aggregate {
        aggregate {
          count
        }
      }
      likes {
        id
        user_id
      }
      saved_post {
        id
        user_id
      }
      comments(order_by: { created_at: desc }) {
        id
        content
        created_at
        user {
          username
          profile_image
        }
      }
    }
  }
`;
