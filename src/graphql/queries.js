import { gql } from "apollo-boost";

export const CHECK_USERNAME_IS_TAKEN = gql`
  query CheckUsernameIsTaken($username: String!) {
    users(where: { username: { _eq: $username } }) {
      username
    }
  }
`;
