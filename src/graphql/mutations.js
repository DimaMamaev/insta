import { gql } from "apollo-boost";

export const CREATE_USER = gql`
  mutation createUser(
    $userId: String!
    $name: String!
    $username: String!
    $email: String!
    $bio: String!
    $website: String!
    $profileImage: String!
    $phoneNumber: String!
  ) {
    insert_users(
      objects: {
        user_id: $userId
        username: $username
        website: $website
        profile_image: $profileImage
        phone_number: $phoneNumber
        name: $name
        email: $email
        bio: $bio
      }
    ) {
      affected_rows
    }
  }
`;

export const UPDATE_USER_PROFILE_DATA = gql`
  mutation editUser(
    $id: uuid!
    $name: String!
    $bio: String
    $username: String!
    $website: String
    $phoneNumber: String
    $email: String!
  ) {
    update_users(
      where: { id: { _eq: $id } }
      _set: {
        bio: $bio
        email: $email
        name: $name
        username: $username
        website: $website
        phone_number: $phoneNumber
      }
    ) {
      affected_rows
    }
  }
`;
