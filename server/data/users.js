import bcrypt from "bcrypt";

const users = [
  {
    name: "Test User",
    email: "test@example.com",
    password: bcrypt.hashSync("123456", 10),
  },
  {
    name: "Second User",
    email: "second@example.com",
    password: bcrypt.hashSync("123456", 10),
  },
];

export default users;
