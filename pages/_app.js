import Head from "next/head";
import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { firebase } from "../Firebase/config";
import "../styles/globals.css";
import "react-circular-progressbar/dist/styles.css";
import Header from "../src/layout/Header";
import Footer from "../src/layout/Footer";
import Layout from "../src/layout/Layout";
function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [inactive, setInactive] = useState(false); // Track user inactivity
  const INACTIVE_TIME = 30000 * 60 * 1000; // 30 minutes in milliseconds

  useEffect(() => {
    let timeoutId;

    const resetTimer = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        // Perform sign-out due to inactivity
        firebase
          .auth()
          .signOut()
          .then(() => {
            setUser(null);
            localStorage.removeItem("myuser");
            toast.warn("You have been signed out due to inactivity.");
          })
          .catch((error) => {
            // Handle sign-out errors if any
            console.error("Error signing out:", error);
          });
      }, INACTIVE_TIME);
    };

    const clearInactiveFlag = () => {
      setInactive(false);
    };

    const handleUserActivity = () => {
      setInactive(true);
      resetTimer();
    };

    const unsubscribe = firebase.auth().onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
        localStorage.setItem(
          "myuser",
          JSON.stringify({ token: authUser.token, email: authUser.email })
        );
        resetTimer(); // Reset the timer on user authentication
      } else {
        setUser(null);
        localStorage.removeItem("myuser");
        setLoading(false);
      }
    });
    // Cleanup function for the useEffect
    // Event listeners for user activity
    window.addEventListener("mousemove", handleUserActivity);
    window.addEventListener("keydown", handleUserActivity);
    window.addEventListener("scroll", handleUserActivity);

    // Clear the inactivity flag on user activity
    if (inactive) {
      clearInactiveFlag();
    }

    // Cleanup function for the useEffect
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      unsubscribe();
      window.removeEventListener("mousemove", handleUserActivity);
      window.removeEventListener("keydown", handleUserActivity);
      window.removeEventListener("scroll", handleUserActivity);
    };
  }, [inactive]);

  const [loader, setLoader] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoader(false);
    }, 1500);
  }, []);

  const [key, setKey] = useState();
  const [progress, setProgress] = useState(0);
  const router = useRouter();
  const [cart, setCart] = useState({});
  const [subTotal, setSubTotal] = useState(0);
  const db = firebase.firestore();

  useEffect(() => {
    router.events.on("routeChangeStart", () => {
      setProgress(40);
    });
    router.events.on("routeChangeComplete", () => {
      setProgress(100);
    });

    try {
      if (localStorage.getItem("cart")) {
        setCart(JSON.parse(localStorage.getItem("cart")));
        saveCart(JSON.parse(localStorage.getItem("cart")));
      }
    } catch (error) {
      localStorage.clear();
    }
    const myuser = JSON.parse(localStorage.getItem("myuser"));
    if (myuser) {
      setUser({ value: myuser.token, email: myuser.email });
    }
    setKey(Math.random());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query]);

  const saveCartToFirestore = async (cartData) => {
    if (user) {
      try {
        await db
          .collection("Users")
          .doc(user.uid)
          .collection("cart")
          .doc("userCart")
          .set(cartData);
        // After saving to Firestore, update the local state subTotal
        updateSubTotal(cartData);
      } catch (error) {
        console.error("Error saving cart to Firestore:", error);
      }
    }
  };

  const fetchCartFromFirestore = async () => {
    if (user) {
      try {
        const cartDoc = await db
          .collection("Users")
          .doc(user.uid)
          .collection("cart")
          .doc("userCart")
          .get();
        if (cartDoc.exists) {
          const cartData = cartDoc.data();
          setCart(cartData);
          updateSubTotal(cartData);
        }
      } catch (error) {
        console.error("Error fetching cart from Firestore:", error);
      }
    }
  };

  const updateSubTotal = (myCart) => {
    let subt = 0;
    Object.values(myCart).forEach((item) => {
      subt += item.price * item.qty;
    });
    setSubTotal(subt);
  };

  const addToCart = (
    itemCode,
    qty,
    price,
    pricecat,
    productname,
    frontImage,
    selectedDate = null
  ) => {
    if (!user) {
      // User is not logged in, redirect to login page
      toast.error("Please log in to add items to cart", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      // Redirect to the login page
      // Modify the '/login' path according to your login page route
      router.push("/login");
      return; // Prevent further execution of addToCart function
    }
    if (Object.keys(cart).length == 0) {
      setKey(Math.random);
    }
    let newCart = cart;
    if (itemCode in cart) {
      newCart[itemCode].qty = cart[itemCode].qty + qty;
    } else {
      newCart[itemCode] = { qty: 1, price, productname, frontImage,pricecat };
    }
    if (selectedDate) {
      newCart[itemCode].selectedDate = selectedDate; // Include the selected date in the cart item
    }
    setCart(newCart);
    saveCartToFirestore(newCart);

    toast.success(`Item added to cart`, {
      position: "top-right",
      autoClose: 3000, // Close the notification after 3 seconds
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const bookNow = (
    itemCode,
    qty,
    price,
    productname,
    frontImage,
    pricecat,
    selectedDate = null
  ) => {
    let newCart = {};
    newCart[itemCode] = { qty: 1, price, productname, frontImage,pricecat };

    if (selectedDate) {
      newCart[itemCode].selectedDate = selectedDate; // If selectedDate is provided, add it to the cart
    }

    setCart(newCart);
    saveCartToFirestore(newCart);
    router.push("/checkout");
  };

  const clearCart = () => {
    setCart({});
    saveCartToFirestore({});
    toast.success("Cart cleared");
  };

  const removeFromCart = (itemCode, qty) => {
    const newCart = { ...cart };
    if (itemCode in newCart) {
      newCart[itemCode].qty -= qty;
      if (newCart[itemCode].qty <= 0) {
        delete newCart[itemCode];
      }
    }
    setCart(newCart);
    saveCartToFirestore(newCart);
    toast.success(`Removed ${qty} items from cart`);
  };

  useEffect(() => {
    fetchCartFromFirestore();
  }, [user]);

  const isAdminRoute = router.pathname.startsWith('/Admin');
  return (
    <Fragment>
      <Head>
        <title>
          JVC Organic - Agriculture &amp; Organic Food React NextJS Template
        </title>
        {/* Favicon Icon */}
        <link
          rel="shortcut icon"
          href="assets/images/favicon.png"
          type="image/x-icon"
        />
        {/* Google Fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Mulish:wght@400;500;600;700&family=Oswald:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {/* Flaticon */}
        <link rel="stylesheet" href="assets/css/flaticon.min.css" />
        {/* Font Awesome */}
        <link rel="stylesheet" href="assets/css/fontawesome-5.14.0.min.css" />
        {/* Bootstrap */}
        <link rel="stylesheet" href="assets/css/bootstrap-4.5.3.min.css" />
        {/* Magnific Popup */}
        <link rel="stylesheet" href="assets/css/magnific-popup.min.css" />
        {/* Nice Select */}
        <link rel="stylesheet" href="assets/css/nice-select.min.css" />
        {/* Animate */}
        <link rel="stylesheet" href="assets/css/animate.min.css" />
        {/* Slick */}
        <link rel="stylesheet" href="assets/css/slick.min.css" />
        {/* Main Style */}
        <link rel="stylesheet" href="assets/css/style.css" />
      </Head>
      
      {!loader && (
        <div>
          {!isAdminRoute && (
            <Layout header={1} footer={1}>
              <Component
                bookNow={bookNow}
                cart={cart}
                addToCart={addToCart}
                removeFromCart={removeFromCart}
                clearCart={clearCart}
                subTotal={subTotal}
                {...pageProps}
              />
            </Layout>
          )}
          {isAdminRoute && (
            <Component
              bookNow={bookNow}
              cart={cart}
              addToCart={addToCart}
              removeFromCart={removeFromCart}
              clearCart={clearCart}
              subTotal={subTotal}
              {...pageProps}
            />
          )}
        </div>
      )}


    <ToastContainer/>
    </Fragment>
  );
}

export default MyApp;
