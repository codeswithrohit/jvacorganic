import { useEffect, useState } from "react";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/router";
import { firebase } from "../../Firebase/config";
import AdminNavbar from "../../src/components/AdminNavbar";
import * as XLSX from "xlsx";
import Link from "next/link";
const Dashboard = () => {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if the user is an admin when the component mounts
  useEffect(() => {
    const isAdminInLocalStorage = localStorage.getItem("isAdmin") === "true";
    setIsAdmin(isAdminInLocalStorage);
    if (!isAdminInLocalStorage) {
      // If the user is not an admin, show a loading message or redirect them to the login page
      router.push("/Admin/adminlogin");
    } else {
    }
  }, [router]);
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/api/UpdateOrderStatus`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ orderId, newStatus }),
        }
      );

      if (res.ok) {
        router.reload();
        // Update the local state or fetch orders again to reflect changes
        // Example: Fetch orders again using fetchOrders() function
      } else {
        // Handle unsuccessful response if needed
      }
    } catch (error) {
      // Handle fetch error
      console.error("Error updating order status:", error);
    }
  };

  useEffect(() => {
    // ... (existing code)

    // Added useEffect to reload the page when orders change due to status update
    const handleOrderUpdate = () => {
      router.reload();
    };

    router.events.on("routeChangeComplete", handleOrderUpdate);

    return () => {
      router.events.off("routeChangeComplete", handleOrderUpdate);
    };
  }, [router]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userToken = JSON.parse(localStorage.getItem("myuser")).token;
        const requestBody = { token: userToken };

        // Include date range if provided
        if (startDate && endDate) {
          requestBody.startDate = startDate;
          requestBody.endDate = endDate;
        }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_HOST}/api/myorders`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
          }
        );

        if (res.ok) {
          const data = await res.json();

          // Assuming 'orders' is a property within the received object
          if (Array.isArray(data.orders)) {
            // Filter orders by date range if provided
            let filteredOrders = data.orders;

            if (startDate && endDate) {
              filteredOrders = filteredOrders.filter(
                (order) =>
                  new Date(order.createdAt) >= new Date(startDate) &&
                  new Date(order.createdAt) <= new Date(endDate)
              );
            }

            // Sort orders by createdAt in descending order (latest first)
            const sortedOrders = filteredOrders.sort((a, b) => {
              return new Date(b.createdAt) - new Date(a.createdAt);
            });
            setOrders(sortedOrders);
          } else {
            console.error("Orders data is not an array:", data.orders);
            // Handle this scenario according to your application logic
          }
        } else {
          // Handle unsuccessful response if needed
        }
      } catch (error) {
        // Handle fetch error
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!localStorage.getItem("myuser")) {
      router.push("/");
    } else {
      fetchOrders();
    }
  }, [router]);
  useEffect(() => {
    // Filter orders based on the selected status
    if (filterStatus === "All") {
      setFilteredOrders(orders);
    } else {
      const filtered = orders.filter(
        (order) => order.deliverystatus === filterStatus
      );
      setFilteredOrders(filtered);
    }
  }, [filterStatus, orders]);

  const totalOrders = orders.length;
  const deliveredOrders = orders.filter(
    (order) => order.deliverystatus === "Delivered"
  ).length;
  const pendingOrders = orders.filter(
    (order) => order.deliverystatus === "Pending"
  ).length;

  const downloadOrders = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(orders);
    XLSX.utils.book_append_sheet(wb, ws, "Orders");
    XLSX.writeFile(wb, "orders.xlsx");
  };

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const fetchOrders = async () => {
    try {
      const userToken = JSON.parse(localStorage.getItem("myuser")).token;
      const requestBody = { token: userToken };

      // Include date range if provided
      if (startDate && endDate) {
        requestBody.startDate = startDate;
        requestBody.endDate = endDate;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/myorders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (res.ok) {
        const data = await res.json();

        // Assuming 'orders' is a property within the received object
        if (Array.isArray(data.orders)) {
          // Filter orders by date range if provided
          let filteredOrders = data.orders;

          if (startDate && endDate) {
            filteredOrders = filteredOrders.filter(
              (order) =>
                new Date(order.createdAt) >= new Date(startDate) &&
                new Date(order.createdAt) <= new Date(endDate)
            );
          }

          // Sort orders by createdAt in descending order (latest first)
          const sortedOrders = filteredOrders.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
          });
          setOrders(sortedOrders);
        } else {
          console.error("Orders data is not an array:", data.orders);
          // Handle this scenario according to your application logic
        }
      } else {
        // Handle unsuccessful response if needed
      }
    } catch (error) {
      // Handle fetch error
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
      <AdminNavbar />
      {loading ? (
        <p className="lg:ml-64 ">Loading...</p> // You can replace this with your desired loading indicator or component
      ) : (
        <>
          <div className="lg:ml-64 bg-white dark:bg-white min-h-screen">
            <section class="px-6 py-6">
              <div class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                <div class="flex items-center justify-between p-4 border-l-2 border-yellow-500 rounded-md shadow dark:border-blue-400 dark:bg-gray-900 bg-gray-50">
                  <div>
                    <p class="mb-2 text-black dark:text-black">Total Orders</p>
                    <h2 class="text-2xl font-bold text-black dark:text-black">
                      {totalOrders}
                    </h2>
                  </div>
                  <div>
                    <span class="inline-block p-4 mr-2 text-white bg-yellow-500 rounded-full dark:text-black dark:bg-gray-700">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        class="w-6 h-6 bi bi-bag-check"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M10.854 8.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 10.793l2.646-2.647a.5.5 0 0 1 .708 0z"
                        ></path>
                        <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z"></path>
                      </svg>
                    </span>
                  </div>
                </div>
                <div class="flex items-center justify-between p-4 border-l-2 border-green-500 rounded-md shadow dark:border-blue-400 dark:bg-gray-900 bg-gray-50">
                  <div>
                    <p class="mb-2 text-black dark:text-black">
                      Delivered Orders
                    </p>
                    <h2 class="text-2xl font-bold text-black dark:text-black">
                      {deliveredOrders}
                    </h2>
                  </div>
                  <div>
                    <span class="inline-block p-4 mr-2 text-white bg-green-500 rounded-full dark:text-black dark:bg-gray-700">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        class="w-6 h-6 bi bi-bag-check"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M10.854 8.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 10.793l2.646-2.647a.5.5 0 0 1 .708 0z"
                        ></path>
                        <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z"></path>
                      </svg>
                    </span>
                  </div>
                </div>
                <div class="flex items-center justify-between p-4 border-l-2 border-red-500 rounded-md shadow dark:border-blue-400 dark:bg-gray-900 bg-gray-50">
                  <div>
                    <p class="mb-2 text-black dark:text-black">
                      Pending Orders
                    </p>
                    <h2 class="text-2xl font-bold text-black dark:text-black">
                      {pendingOrders}
                    </h2>
                  </div>
                  <div>
                    <span class="inline-block p-4 mr-2 text-white bg-red-500 rounded-full dark:text-black dark:bg-gray-700">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        class="w-6 h-6 bi bi-bag-check"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M10.854 8.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 10.793l2.646-2.647a.5.5 0 0 1 .708 0z"
                        ></path>
                        <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z"></path>
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <body class="antialiased font-sans ">
              <div class=" px-4 sm:px-8">
                <div class="py-8">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-semibold">Orders</h2>
                    <div className="space-x-4 flex flex-col md:flex-row ">
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="px-4 py-2 text-sm mb-2 font-semibold bg-red-600 border-none text-white rounded focus:outline-none"
                        placeholder="Start Date"
                      />

                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="px-4 py-2 text-sm mb-2 font-semibold bg-red-600 border-none text-white rounded focus:outline-none"
                        placeholder="End Date"
                      />

                      <button
                        onClick={fetchOrders}
                        className="px-4 py-2 text-sm mb-2 font-semibold bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
                      >
                        Filter Orders
                      </button>
                      <button
                        onClick={downloadOrders}
                        className="px-4 py-2 text-sm mb-2 font-semibold bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring focus:ring-green-300"
                      >
                        Download Orders
                      </button>
                    </div>
                  </div>

                  <div class="my-2 ml-8 flex sm:flex-row flex-col">
                    <div class="flex flex-row mb-1 sm:mb-0">
                      <div class="relative">
                        <select
                          value={filterStatus}
                          onChange={(e) => setFilterStatus(e.target.value)}
                          class="appearance-none h-full rounded-r border-t sm:rounded-r-none sm:border-r-0 border-r border-b block appearance-none w-full bg-white border-gray-400 text-black py-2 px-4 pr-8 leading-tight focus:outline-none focus:border-l focus:border-r focus:bg-white focus:border-gray-500"
                        >
                          <option value="All">All</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Pending">Pending</option>
                        </select>
                        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-black">
                          <svg
                            class="fill-current h-4 w-4"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                    <div class="inline-block min-w-full shadow rounded-lg overflow-hidden">
                      <table class="min-w-full leading-normal">
                        <thead>
                          <tr>
                            <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-black uppercase tracking-wider">
                              User Name
                            </th>
                            <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-black uppercase tracking-wider">
                              Email
                            </th>
                            <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-black uppercase tracking-wider">
                              Mobile Number
                            </th>
                            <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-black uppercase tracking-wider">
                              Address
                            </th>
                            <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-black uppercase tracking-wider">
                              Product Details
                            </th>

                            <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-black uppercase tracking-wider">
                              Status
                            </th>
                            <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-black uppercase tracking-wider"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredOrders.map((order, index) => (
                            <tr key={order._id}>
                              <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                <p class="text-black whitespace-no-wrap">
                                  {order.name}
                                </p>
                              </td>
                              <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                <p class="text-black whitespace-no-wrap">
                                  {order.email}
                                </p>
                              </td>
                              <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                <p class="text-black whitespace-no-wrap">
                                  {order.phone}
                                </p>
                              </td>

                              <td class="px-5 py-5 border-b border-gray-200  bg-white text-sm">
                                <p class="text-black whitespace-no-wrap">
                                  {order.address}
                                </p>
                              </td>
                              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                <Link
                                  href={`/Admin/Adminorder?id=${order._id}`}
                                  legacyBehavior
                                >
                                  <span className="relative cursor-pointer inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                                    <span
                                      aria-hidden
                                      className="absolute inset-0 bg-green-200 opacity-50 rounded-full"
                                    ></span>
                                    <span className="relative">Details</span>
                                  </span>
                                </Link>
                              </td>
                              <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                <button>{order.deliverystatus}</button>
                              </td>

                              <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                <select
                                  value={order.deliverystatus}
                                  onChange={(e) =>
                                    updateOrderStatus(order._id, e.target.value)
                                  }
                                  className="text-black whitespace-no-wrap"
                                >
                                  <option value="Pending">Pending</option>
                                  <option value="Processing">Processing</option>
                                  <option value="Shipped">Shipped</option>
                                  <option value="Delivered">Delivered</option>
                                </select>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </body>

            <script
              defer
              src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"
            ></script>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
