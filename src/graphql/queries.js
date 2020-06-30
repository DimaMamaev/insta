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
