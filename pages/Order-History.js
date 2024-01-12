import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";
import { firebase } from "../Firebase/config";
const OrderHistory = () => {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // State to track loading

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userToken = JSON.parse(localStorage.getItem("myuser")).token;

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_HOST}/api/myorders`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token: userToken }), // Pass user's token to the backend
          }
        );

        if (res.ok) {
          const data = await res.json();
          // Filter orders based on user email
          const filteredOrders = data.orders.filter(
            (order) => order.email === user.email
          );
          setOrders(filteredOrders);
        } else {
          // Handle unsuccessful response if needed
        }
      } catch (error) {
        // Handle fetch error
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false); // Update loading state after fetching
      }
    };

    if (!localStorage.getItem("myuser")) {
      router.push("/");
    } else {
      fetchOrders();
    }
  }, [router, user]); // Include user.email in the dependency array

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);
  return (
    <div >
      <div>
        {loading ? ( // Display loading indicator if loading is true
          <div className="preloader">
            <div className="loader">
              {/* You can use the img tag to display the 'ramji.gif' image */}
              <img className="h-64 w-64" src="ramji.gif" alt="Loading..." />
              {/* You can retain your existing loader structure if needed */}
            </div>
          </div>
        ) : (
          <div class="bg-white p-8 rounded-md w-full py-24 ">
            <div class=" flex items-center justify-between pb-6">
              <div>
                <h2 class="text-black font-semibold">Products Order</h2>
                <span class="text-xs">All products item</span>
              </div>
            </div>
            <div>
              <div class="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                <div class="inline-block min-w-full shadow rounded-lg overflow-hidden">
                  {orders.length === 0 ? (
                    <p>No orders found.</p>
                  ) : (
                    <table class="min-w-full leading-normal">
                      <thead>
                        <tr>
                          <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-black uppercase tracking-wider">
                            Product Name
                          </th>
                          <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-black uppercase tracking-wider">
                            Email
                          </th>
                          <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-black uppercase tracking-wider">
                            OrderId
                          </th>
                          <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-black uppercase tracking-wider">
                            Amount
                          </th>
                          <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-black uppercase tracking-wider">
                            Details
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <React.Fragment key={order._id}>
                            {/* Iterate through products in the order */}
                            {order.products &&
                              Object.values(order.products).map((product) => (
                                <tr key={product._id}>
                                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <div className="flex items-center">
                                      {/* Display product image */}
                                      <div className="flex-shrink-0 w-10 h-10">
                                        {product.frontImage && (
                                          <img
                                            className="w-full h-full rounded-full"
                                            src={product.frontImage}
                                            alt=""
                                          />
                                        )}
                                      </div>
                                      {/* Display product name */}
                                      <div className="ml-3">
                                        {product.productname && (
                                          <p className="text-black whitespace-no-wrap">
                                            {product.productname}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <p className="text-black whitespace-no-wrap">
                                      {order.email}
                                    </p>
                                  </td>
                                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <p className="text-black whitespace-no-wrap">
                                      #{order.orderId}
                                    </p>
                                  </td>
                                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <p className="text-black whitespace-no-wrap">
                                      ₹{order.amount}
                                    </p>
                                  </td>
                                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <Link
                                      href={`/order?id=${order._id}`}
                                      legacyBehavior
                                    >
                                      <span className="relative cursor-pointer inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                                        <span
                                          aria-hidden
                                          className="absolute inset-0 bg-green-200 opacity-50 rounded-full"
                                        ></span>
                                        <span className="relative">
                                          Details
                                        </span>
                                      </span>
                                    </Link>
                                  </td>
                                  {/* Other table columns */}
                                </tr>
                              ))}
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
