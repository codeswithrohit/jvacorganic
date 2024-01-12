import React, { useEffect, useState } from "react";
import Head from "next/head";
import Script from "next/script";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { firebase } from "../Firebase/config";
import { useRouter } from "next/router";

const Checkout = ({ cart, clearCart, subTotal, dateRange,addToCart,removeFromCart }) => {
  console.log(cart);
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [disabled, setDisabled] = useState(true);
  const [user, setUser] = useState({ value: null });

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
        fetchUserData(authUser.uid);
      } else {
        setUser(null);
        setUserData(null);
        setLoading(false); // Set loading to false if user is not authenticated
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserData = async (uid) => {
    try {
      const userDoc = await firebase
        .firestore()
        .collection("Users")
        .doc(uid)
        .get();
      if (userDoc.exists) {
        const userData = userDoc.data();
        setUserData(userData);
        setMobileNumber(userData?.mobileNumber || "");
        setAddress(userData?.address || "");
      }
      setLoading(false); // Set loading to false after user data is fetched
    } catch (error) {
      console.error("Error fetching user data:", error);
      setLoading(false); // Set loading to false if an error occurs
    }
  };

  useEffect(() => {
    // ... (existing code)

    // Fetching user data and setting input fields with user data
    if (userData) {
      setName(userData.name || "");
      setEmail(userData.email || "");
      const extractLastTenDigits = (phoneNumber) => {
        const trimmedNumber = phoneNumber.toString().replace(/\D/g, ""); // Remove non-digit characters
        return trimmedNumber.slice(-10); // Extract last 10 digits
      };

      setPhone(
        userData?.mobileNumber
          ? extractLastTenDigits(userData.mobileNumber)
          : ""
      );

      setAddress(userData.address || "");
    }
  }, [userData]);

  useEffect(() => {
    if (
      name.length > 3 &&
      email.length > 3 &&
      phone.length > 3 &&
      address.length > 3
    ) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [name, email, address, phone]);

  const handleChange = (e) => {
    if (e.target.name == "name") {
      setName(e.target.value);
    } else if (e.target.name == "email") {
      setEmail(e.target.value);
    } else if (e.target.name == "address") {
      setAddress(e.target.value);
    } else if (e.target.name == "phone") {
      setPhone(e.target.value);
    }

    if (name && email && phone && address) {
      setDisabled(false);
    }
  };

  const initiatePayment = async () => {
    setIsLoading(true);
    let oid = Math.floor(Math.random() * Date.now());

    // Get a transaction token
    const data = { cart, subTotal, oid, email: email, name, address, phone };
    let a = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/pretransaction`, {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    let txnRes = await a.json();
    if (txnRes.success) {
      //console.log(txnRes)
      let txnToken = txnRes.txnToken;

      var config = {
        root: "",
        flow: "DEFAULT",
        data: {
          orderId: oid /* update order id */,
          token: txnToken /* update token value */,
          tokenType: "TXN_TOKEN",
          amount: subTotal /* update amount */,
        },
        handler: {
          notifyMerchant: function (eventName, data) {
            console.log("notifyMerchant handler function called");
            console.log("eventName => ", eventName);
            console.log("data => ", data);
          },
        },
      };

      window.Paytm.CheckoutJS.init(config)
        .then(function onSuccess() {
          // after successfully updating configuration, invoke JS Checkout
          window.Paytm.CheckoutJS.invoke();
          setIsLoading(false);
        })
        .catch(function onError(error) {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
      if (txnRes.cartClear) {
        clearCart();
      }
      toast.error(txnRes.error, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <div >
      <div class="relative min-h-screen mx-auto w-full bg-white">
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />

        <Script
          type="application/javascript"
          crossorigin="anonymous"
          src={`${process.env.NEXT_PUBLIC_PAYTM_HOST}/merchantpgpui/checkoutjs/merchants/${process.env.NEXT_PUBLIC_PAYTM_MID}.js`}
        />
        <div class="grid py-12  grid-cols-10">
          <div class="col-span-full py-6 px-4 sm:py-12 lg:col-span-6 lg:py-24">
            <div class="mx-auto w-full max-w-lg">
              <h1 class="relative text-2xl font-medium text-black sm:text-3xl">
                {" "}
                Checkout
                <span class="mt-2 block h-1 w-10 bg-red-600 sm:w-20"></span>
              </h1>
              <form action="" class="mt-10 flex flex-col space-y-4">
                <div>
                  <label for="name" class="text-xs font-semibold text-black">
                    Name
                  </label>
                  <input
                    onChange={handleChange}
                    value={name}
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Enter Your Name"
                    class="mt-1 block w-full rounded border-gray-300 bg-gray-50 py-3 px-4 text-sm placeholder-gray-300 shadow-sm outline-none transition focus:ring-2 focus:ring-red-600"
                  />
                </div>
                <div>
                  <label for="email" class="text-xs font-semibold text-black">
                    Email
                  </label>
                  {user && user.token ? (
                    <input
                      value={user.email}
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Enter Your Email"
                      className="mt-1 block w-full rounded border-gray-300 bg-gray-50 py-3 px-4 text-sm placeholder-gray-300 shadow-sm outline-none transition focus:ring-2 focus:ring-red-600"
                      readOnly // Making the input read-only when the user is logged in
                    />
                  ) : (
                    <input
                      onChange={handleChange}
                      value={email}
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Enter Your Email"
                      className="mt-1 block w-full rounded border-gray-300 bg-gray-50 py-3 px-4 text-sm placeholder-gray-300 shadow-sm outline-none transition focus:ring-2 focus:ring-red-600"
                      // Allowing the user to type in the email when not logged in
                    />
                  )}
                </div>

                <div>
                  <label for="phone" class="text-xs font-semibold text-black">
                    Mobile Number
                  </label>
                  <input
                    onChange={handleChange}
                    value={phone}
                    type="phone"
                    id="phone"
                    name="phone"
                    placeholder="Enter Your 10 Digit Phone Number"
                    class="mt-1 block w-full rounded border-gray-300 bg-gray-50 py-3 px-4 text-sm placeholder-gray-300 shadow-sm outline-none transition focus:ring-2 focus:ring-red-600"
                  />
                </div>
                <div>
                  <label for="address" class="text-xs font-semibold text-black">
                    Address
                  </label>
                  <textarea
                    onChange={handleChange}
                    value={address}
                    name="address"
                    id="address"
                    cols="30"
                    row="2"
                    placeholder="Enter Your Address"
                    class="mt-1 block w-full rounded border-gray-300 bg-gray-50 py-3 px-4 text-sm placeholder-gray-300 shadow-sm outline-none transition focus:ring-2 focus:ring-red-600"
                  ></textarea>
                </div>
              </form>
              <p class="mt-10 text-center text-sm font-semibold text-black">
                By placing this order you agree to the{" "}
                <a
                  href="#"
                  class="whitespace-nowrap text-red-600 underline hover:text-red-600"
                >
                  Terms and Conditions
                </a>
              </p>
              {isLoading ? (
                <div className="mx-4">
                  <button class="mt-4 inline-flex w-full items-center justify-center rounded bg-red-600 py-2.5 px-4 text-base font-semibold tracking-wide text-white text-opacity-80 outline-none ring-offset-2 transition hover:text-opacity-100 focus:ring-2 focus:ring-red-600 sm:text-lg">
                    Loading...
                  </button>
                </div>
              ) : (
                <Link href={"/checkout"}>
                  <button
                    disabled={disabled}
                    onClick={initiatePayment}
                    class="mt-4 inline-flex w-full items-center justify-center rounded bg-red-600 py-2.5 px-4 text-base font-semibold tracking-wide text-white text-opacity-80 outline-none ring-offset-2 transition hover:text-opacity-100 focus:ring-2 focus:ring-red-600 sm:text-lg"
                  >
                    Make Payment ₹{subTotal}
                  </button>
                </Link>
              )}
            </div>
          </div>

          <div class="relative col-span-full flex flex-col py-6 pl-8 pr-4 sm:py-12 lg:col-span-4 lg:py-24">
  <div class="px-4 pt-8">
    <p class="text-xl font-medium">Order Summary</p>
    <div class="mt-8 space-y-3 rounded-lg border bg-white px-2 py-4 sm:px-6">
      {Object.keys(cart).length === 0 && (
        <div className="my-4 font-semibold text-center text-red-600">Your Cart is Empty!</div>
      )}
      <div>
        {Object.keys(cart).map((k) => (
          <div key={k} className="flex flex-col rounded-lg bg-white sm:flex-row items-center border p-4">
            <img
              className="m-2 h-24 w-28 rounded-md border object-cover object-center"
              src={cart[k].frontImage}
              alt=""
            />
            <div className="flex flex-col justify-center w-full sm:w-1/2 px-4">
              <span className="font-semibold text-center">
                {cart[k].productname}
              </span>
              <div className="flex">
              <p className="text-lg font-bold text-center mt-1">
                ₹ {cart[k].price}
              </p>
              <p className="text-lg ml-2 font-bold text-center mt-1">
               {cart[k].pricecat}
              </p>
              </div>
              {/* Display the selected dates in the cart */}
              <div class="flex items-center justify-center mt-4">
                <button
                  onClick={() => removeFromCart(k, 1, cart[k].price, cart[k].bookName)}
                  class="text-gray-500 hover:text-black dark:text-black"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash" viewBox="0 0 16 16">
                    <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"></path>
                  </svg>
                </button>
                <div className="w-12 px-2 py-1 text-center border border-gray-200 dark:border-gray-700 dark:bg-gray-800 bg-gray-50 dark:text-black md:text-right">
                  {cart[k].qty}
                </div>
                <button
                  onClick={() => addToCart(k, 1, cart[k].price, cart[k].bookName)}
                  class="text-gray-500 hover:text-black dark:text-black"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus" viewBox="0 0 16 16">
                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className="flex justify-center mt-6">
      <Link href="/">
        <button className="px-6 py-3 text-white bg-green-600 rounded-md shadow-lg hover:bg-green-700 transition-colors duration-300">
          Back to our Store
        </button>
      </Link>
    </div>
  </div>
</div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;