import React, { createContext, useState } from "react";

const CartContext = createContext();

const CartProvider = (props) => {
  const [cart, setCart] = useState([]);

  return React.createElement(
    CartContext.Provider,
    { value: { cart, setCart } },
    props.children
  );
};

export const useCart = () => React.useContext(CartContext);
export default CartProvider;