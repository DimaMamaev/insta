import { v4 as uuid } from "uuid";

export const defaultUser = {
  id: uuid(),
  username: "Odinson",
  name: "Thor",
  profile_image:
    "https://images-na.ssl-images-amazon.com/images/I/71kNvlpS9GL._AC_SL1000_.jpg",
  // profile_image:
  // "https://instagram.com/static/images/anonymousUser.jpg/23e7b3b2a737.jpg"
};

export function getDefaultUser() {
  return {
    id: uuid(),
    username: "Odinson",
    name: "Thor",
    profile_image:
      "https://images-na.ssl-images-amazon.com/images/I/71kNvlpS9GL._AC_SL1000_.jpg",
  };
}

export const defaultPost = {
  id: uuid(),
  likes: 10,
  caption: `<span class="">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 🤔⚛️👇<br>•<br>•<br>👉 Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 🔥</span>`,
  user: defaultUser,
  media: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__340.jpg",
  comments: [],
  created_at: "2020-02-28T03:08:14.522421+00:00",
};

export function getDefaultPost() {
  return {
    id: uuid(),
    likes: 10,
    caption: `<span class="">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 🤔⚛️👇<br>•<br>•<br>👉 Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 🔥</span>`,
    user: defaultUser,
    media:
      "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__340.jpg",
    comments: [],
    created_at: "2020-02-28T03:08:14.522421+00:00",
  };
}

export const defaultNotifications = [
  {
    id: uuid(),
    type: "follow",
    user: defaultUser,
    created_at: "2020-02-29T03:08:14.522421+00:00",
  },
  {
    id: uuid(),
    type: "like",
    user: defaultUser,
    post: defaultPost,
    created_at: "2020-02-29T03:08:14.522421+00:00",
  },
];

export const defaultCurrentUser = {
  id: uuid(),
  username: "Loki",
  name: "cat",
  profile_image:
    "https://images.fineartamerica.com/images/artworkimages/mediumlarge/1/cool-cat-with-glasses-and-headphones-julio-cesar.jpg",
  website: "https://react12.io",
  email: "me@gmail.com",
  bio: "This is my bio",
  phone_number: "555-555-5555",
  posts: Array.from({ length: 10 }, () => getDefaultPost()),
  followers: [defaultUser],
  following: [defaultUser],
};
