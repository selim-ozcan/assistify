import Footer from "@/components/ui/Footer";
import Navbar from "@/components/ui/Navbar";
import CartContext from "@/context/cartContext";
import UserContext from "@/context/store";
import { socket } from "@/socket";
import "@/styles/globals.css";
import { ThemeProvider } from "@material-tailwind/react";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";

export default function App({ Component, pageProps }: AppProps) {
  const [user, setUser] = useState(null);
  const value = { user, setUser };
  const [cart, setCart] = useState([]);
  const cartValue = { cart, setCart };

  useEffect(() => {
    socket.connect();
  }, []);
  return (
    <ThemeProvider>
      <UserContext.Provider value={value}>
        <CartContext.Provider value={cartValue}>
          <Navbar></Navbar>
          <div className={"h-[76vh] overflow-scroll bg-blue-gray-50"}>
            <Component {...pageProps} />
          </div>
          <Footer></Footer>
        </CartContext.Provider>
      </UserContext.Provider>
    </ThemeProvider>
  );
}
