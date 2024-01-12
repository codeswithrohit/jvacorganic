
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { firebase } from "../Firebase/config";
import Link from "next/link";
import { FaPhoneAlt } from "react-icons/fa";
import { SiGooglepay, SiVisa, SiMastercard } from "react-icons/si";
import { RiBankLine } from "react-icons/ri";
const Cart = ({ addToCart, cart, removeFromCart, clearCart, subTotal }) => {
  console.log(cart);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        // User is not logged in, redirect to login page
        window.location.href = '/login'; // Change '/login' to your actual login page
      }
    });

    return () => unsubscribe();
  }, []);
  console.log(subTotal)
  const paymentMethods = [
    { icon: <FaPhoneAlt />, label: "PhonePe" },
    { icon: <SiGooglepay />, label: "GPay" },
    { icon: <RiBankLine />, label: "UPI" },
    { icon: <SiVisa />, label: "Visa" },
    { icon: <SiMastercard />, label: "Mastercard" },
    { icon: <RiBankLine />, label: "RuPay" },
  ];


  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };
  return (
    <div >
      <div className="min-h-screen">
        <section class="flex items-center pt-10 bg-white  font-poppins dark:bg-gray-700 ">
          <div class="justify-center flex-1 px-4 py-6 mx-auto max-w-7xl lg:py-4 md:px-6">
            <div class="p-8 bg-gray-50 dark:bg-gray-800">
              <h2 class="mb-8 text-4xl font-bold dark:text-black">
                Shopping Cart
              </h2>
              <div class="flex flex-wrap -mx-4">
                <div class="w-full px-4 mb-8 xl:w-8/12 xl:mb-0">
                  <div class="flex flex-wrap items-center mb-6 -mx-4 md:mb-8">
                    <div class="w-full md:block hidden px-4 mb-6 md:w-4/6 lg:w-6/12 md:mb-0">
                      <h2 class="font-bold text-black dark:text-black">
                        Product name
                      </h2>
                    </div>
                    <div class="hidden px-4 lg:block lg:w-2/12">
                      <h2 class="font-bold text-black dark:text-black">
                        Price
                      </h2>
                    </div>
                    <div class="hidden md:block px-4 md:w-1/6 lg:w-2/12 ">
                      <h2 class="font-bold text-black dark:text-black">
                        Quantity
                      </h2>
                    </div>
                  </div>

                  {Object.keys(cart).length == 0 && (
                    <div className="text-center text-red-600 text-xl justify-center mb-12">
                      No item in the cart
                    </div>
                  )}
                  {Object.keys(cart).map((k) => {
                    return (
                      <div
                        key={k}
                        class="py-4 mb-8 border-t border-b border-gray-200 dark:border-gray-700"
                      >
                        <div class="flex flex-wrap items-center mb-6 -mx-4 md:mb-8">
                          <div class="w-full px-4 mb-6 md:w-4/6 lg:w-6/12 md:mb-0">
                            <div class="flex flex-wrap items-center -mx-4">
                              <div class="w-full px-4 mb-3 md:w-1/3">
                                <div class="w-24 h-24 md:h-24 md:w-24">
                                  <img
                                    src={cart[k].frontImage}
                                    alt=""
                                    class="object-cover w-24 h-24"
                                  />
                                </div>
                              </div>
                              <div class="w-2/3 px-4">
                                <h2 class="mb-2 text-xl font-bold dark:text-black">
                                  {cart[k].productname}
                                </h2>
                              </div>
                            </div>
                          </div>
                          <div class="hidden px-4 lg:block lg:w-2/12">
                            <p class="text-lg font-bold text-red-600 dark:text-black">
                              ₹{cart[k].price}
                            </p>
                          </div>
                          <div class="w-auto px-4 md:w-1/6 lg:w-2/12 ">
                            <div class="inline-flex items-center px-4 font-semibold text-black border border-gray-200 rounded-md dark:border-gray-700 ">
                              <button
                                onClick={() => {
                                  removeFromCart(
                                    k,
                                    1,
                                    cart[k].price,
                                    cart[k].bookName
                                  );
                                }}
                                class="py-2 hover:text-black dark:text-black"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  fill="currentColor"
                                  class="bi bi-dash"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"></path>
                                </svg>
                              </button>
                              <div className="w-12 px-2 py-4 text-center border-0 rounded-md dark:bg-gray-800 bg-gray-50 dark:text-black md:text-right">
                                {cart[k].qty}
                              </div>
                              <button
                                onClick={() => {
                                  addToCart(
                                    k,
                                    1,
                                    cart[k].price,
                                    cart[k].bookName
                                  );
                                }}
                                class="py-2 hover:text-black dark:text-black"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  fill="currentColor"
                                  class="bi bi-plus"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"></path>
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* <div class="flex flex-wrap items-center gap-4">
<span class="text-black dark:text-black">Apply Coupon</span>
<input type="text" class="flex-1 px-8 py-4 font-normal placeholder-gray-300 border dark:border-gray-700 dark:placeholder-gray-500 md:flex-none md:mr-6 dark:text-black dark:bg-gray-800" placeholder="x304k45" required=""/>
<button class="flex-1 inline-block px-8 py-4 font-bold text-center text-black bg-red-600 rounded-md hover:bg-red-600 md:flex-none">Apply</button>
</div> */}
                </div>
                <div class="w-full md:-mt-20 px-4 xl:w-4/12">
                  <div class="p-6 border border-red-100 dark:bg-gray-900 dark:border-gray-900 bg-red-50 md:p-8">
                    <h2 class="mb-8 text-3xl font-bold text-black dark:text-black">
                      Order Summary
                    </h2>
                    <div class="flex items-center justify-between pb-4 mb-4 border-b border-gray-300 dark:border-gray-700 ">
                      <span class="text-black dark:text-black">Subtotal</span>
                      <span class="text-xl font-bold text-black dark:text-black ">
                        ₹{subTotal}
                      </span>
                    </div>
                    <div class="flex items-center justify-between pb-4 mb-4 ">
                      <span class="text-black dark:text-black ">Shipping</span>
                      <span class="text-xl font-bold text-black dark:text-black ">
                        Free
                      </span>
                    </div>
                    <div class="flex items-center justify-between pb-4 mb-4 ">
                      <span class="text-black dark:text-black">
                        Order Total
                      </span>
                      <span class="text-xl font-bold text-black dark:text-black">
                        ₹{subTotal}.00
                      </span>
                    </div>
                    <h2 class="text-lg text-black dark:text-black">
                      We offer:
                    </h2>
                    <div class="flex items-center mb-4 ">
                      <a href="#">
                        <img
                          src="https://i.postimg.cc/g22HQhX0/70599-visa-curved-icon.png"
                          alt=""
                          class="object-cover h-16 mr-2 w-26"
                        />
                      </a>
                      <a href="#">
                        <img
                          src="https://i.postimg.cc/HW38JkkG/38602-mastercard-curved-icon.png"
                          alt=""
                          class="object-cover h-16 mr-2 w-26"
                        />
                      </a>
                      <a href="#">
                        <img
                          src="https://resize.indiatvnews.com/en/resize/newbucket/1200_-/2019/08/rupay-card-1566468196.jpg"
                          alt=""
                          class="object-cover h-16 mr-2 w-26"
                        />
                      </a>
                    </div>
                    <div class="flex items-center justify-between ">
                      <button
                        onClick={clearCart}
                        class="block w-full text-xs mr-4 py-4 font-bold text-center text-black uppercase bg-red-500 rounded-md hover:bg-red-600"
                      >
                        Clear Cart
                      </button>
                      <Link

                        href="/checkout"
                      >
                        <button class="block text-xs w-full py-4 font-bold text-center text-black uppercase bg-red-600 rounded-md hover:bg-red-600">
                        <span>Proceed to buy</span>
                        </button>
                      </Link>
                    </div>
                    <div className="flex justify-center items-center mt-2 h-full">
                      <Link href="/">
                        <button
                          onClick={scrollToBottom}
                          className="px-6 py-3 text-white bg-green-600 rounded-md shadow-lg hover:bg-green-600"
                        >
                          Back to our Store
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Cart;