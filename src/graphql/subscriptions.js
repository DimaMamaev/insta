import { gql } from "apollo-boost";

export const CURRENT_USER_DATA = gql`
  subscription CurrentUserData($userId: String) {
    users(where: { user_id: { _eq: $userId } }) {
      id
      user_id
      last_checked
      name
      username
      profile_image
    }
  }
`;
