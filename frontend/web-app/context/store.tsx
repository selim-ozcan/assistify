import { Dispatch, SetStateAction, createContext } from "react";

const UserContext = createContext({
  user: null,
  setUser: (() => {}) as Dispatch<SetStateAction<null>>,
});

export default UserContext;
