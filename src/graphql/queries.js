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
    }
  }
`;
