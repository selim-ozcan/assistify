import { Dispatch, SetStateAction, createContext } from "react";

const CartContext = createContext({
  cart: null,
  setCart: null,
});

export default CartContext;
