import { gql } from "apollo-boost";

export const CHECK_USERNAME_IS_TAKEN = gql`
  query CheckUsernameIsTaken($username: String!) {
    users(where: { username: { _eq: $username } }) {
      username
    }
  }
`;
export const GET_USER_EMAIL = gql`
  query getUserEmail($login: String!) {
    users(
      where: {
        _or: [{ username: { _eq: $login } }, { phone_number: { _eq: $login } }]
      }
    ) {
      email
    }
  }
`;

export const GET_EDIT_USER_PROFILE = gql`
  query getEditUserProfile($id: uuid!) {
    users_by_pk(id: $id) {
      bio
      email
      id
      name
      phone_number
      profile_image
      username
      website
    }
  }
`;

export const SEARCH_USERS = gql`
  query searchUser($query: String) {
    users(
      where: {
        _or: [{ username: { _ilike: $query } }, { name: { _ilike: $query } }]
      }
    ) {
      profile_image
      username
      name
      id
    }
  }
`;
export const GET_USER_PROFILE = gql`
  query getUserProfile($username: String!) {
    users(where: { username: { _eq: $username } }) {
      id
      name
      username
      website
      bio
      profile_image
      posts_aggregate {
        aggregate {
          count
        }
      }
      followers_aggregate {
        aggregate {
          count
        }
      }
      following_aggregate {
        aggregate {
          count
        }
      }
      saved_posts(order_by: { created_at: desc }) {
        posts {
          id
          media
          comments_aggregate {
            aggregate {
              count
            }
          }
          likes_aggregate {
            aggregate {
              count
            }
          }
        }
      }
      posts(order_by: { created_at: desc }) {
        id
        media
        likes_aggregate {
          aggregate {
            count
          }
        }
        comments_aggregate {
          aggregate {
            count
          }
        }
      }
    }
  }
`;
export const SUGGEST_USERS = gql`
  query suggestUsers(
    $limit: Int!
    $followerIds: [uuid!]!
    $createdAt: timestamptz!
  ) {
    users(
      limit: $limit
      where: {
        _or: [
          { id: { _in: $followerIds } }
          { created_at: { _gt: $createdAt } }
        ]
      }
    ) {
      id
      name
      username
      profile_image
    }
  }
`;

export const EXPLORE_POSTS = gql`
  query explorePosts($feedIds: [uuid!]!) {
    posts(
      order_by: {
        created_at: desc
        likes_aggregate: { count: desc }
        comments_aggregate: { count: desc }
      }
      where: { user_id: { _nin: $feedIds } }
    ) {
      id
      media
      comments_aggregate {
        aggregate {
          count
        }
      }
      likes_aggregate {
        aggregate {
          count
        }
      }
    }
  }
`;

export const GET_MORE_POSTS_FROM_USER = gql`
  query getMorePostsFromUser($userId: uuid!, $postId: uuid!) {
    posts(
      limit: 6
      where: { user_id: { _eq: $userId }, _not: { id: { _eq: $postId } } }
    ) {
      id
      media
      comments_aggregate {
        aggregate {
          count
        }
      }
      likes_aggregate {
        aggregate {
          count
        }
      }
    }
  }
`;
export const GET_POSTS = gql`
  query getPost($postId: uuid!) {
    posts_by_pk(id: $postId) {
      id
      user {
        id
        username
      }
    }
  }
`;
export const GET_FEED = gql`
  query getFeed($limit: Int!, $feedIds: [uuid!]!, $lastTimestamp: timestamptz) {
    posts(
      limit: $limit
      where: { user_id: { _in: $feedIds }, created_at: { _lt: $lastTimestamp } }
      order_by: { created_at: desc }
    ) {
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
      comments_aggregate {
        aggregate {
          count
        }
      }
      comments(order_by: { created_at: desc }, limit: 2) {
        id
        content
        created_at
        user {
          username
        }
      }
    }
  }
`;
