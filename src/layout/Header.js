import { useState, useEffect } from "react";
import { firebase } from "../../Firebase/config";
import Link from "next/link";
import { FaUser, FaShoppingCart } from "react-icons/fa"; // Import the cart icon
import { sidebarToggle } from "../utils";
import { Blog, Contact, Home, PagesDasktop, Portfolio, Shop } from "./Menus";
import MobileMenu from "./MobileMenu";

const Header = ({ header }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
        fetchUserData(authUser.uid); // Fetch user data based on UID
      } else {
        setUser(null);
        setUserData(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Function to fetch user data from Firestore
  const fetchUserData = async (uid) => {
    try {
      const userDoc = await firebase
        .firestore()
        .collection("Users")
        .doc(uid)
        .get();
      if (userDoc.exists) {
        const userData = userDoc.data();
        if (userData && userData.photoURL) {
          setUserData(userData);
        } else {
          // If photoURL is missing or undefined, set it to a default value or null
          setUserData({ ...userData, photoURL: null }); // You can set a default value or handle it as per your requirement
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  console.log(userData);

  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setLoggingOut(true); // Set state to indicate logout is in progress
      await firebase.auth().signOut(); // Perform the logout action using Firebase Auth
      // Additional cleanup or state resetting if needed after logout

      setLoggingOut(false); // Reset state after successful logout
      window.location.reload();
    } catch (error) {
      console.error("Error during logout:", error);
      setLoggingOut(false); // Reset state in case of an error during logout
    }
  };

  const [showDropdown, setShowDropdown] = useState(false);

  const handleMouseEnter = () => {
    setShowDropdown(true);
  };

  const handleMouseLeave = () => {
    setShowDropdown(false);
  };
  switch (header) {
    case 1:
      return <Header1 userData={userData} handleLogout={handleLogout} user={user} handleMouseEnter={handleMouseEnter} handleMouseLeave={handleMouseLeave} showDropdown={showDropdown} />;

 
  }
};
export default Header;


const DaskTopMenu = () => (
  <ul className="navigation clearfix d-none d-lg-flex">
    <li className="dropdown">
      <a href="#">Home</a>
      {/* <ul>
        <Home />
      </ul> */}
      {/* <div className="dropdown-btn">
        <span className="fas fa-chevron-down" />
      </div> */}
    </li>
    {/* <li className="dropdown">
      <a href="#">pages</a>
      <ul>
        <PagesDasktop />
      </ul>
      <div className="dropdown-btn">
        <span className="fas fa-chevron-down" />
      </div>
    </li>
    <li className="dropdown">
      <a href="#">portfolio</a>
      <ul>
        <Portfolio />
      </ul>
      <div className="dropdown-btn">
        <span className="fas fa-chevron-down" />
      </div>
    </li>
    <li className="dropdown">
      <a href="#">blog</a>
      <ul>
        <Blog />
      </ul>
      <div className="dropdown-btn">
        <span className="fas fa-chevron-down" />
      </div>
    </li>
    <li className="dropdown">
      <a href="#">shop</a>
      <ul>
        <Shop />
      </ul>
      <div className="dropdown-btn">
        <span className="fas fa-chevron-down" />
      </div>
    </li> */}
    <Contact />
  </ul>
);

const Nav = () => {
  const [nav, setNav] = useState(false);
  return (
    <nav className="main-menu navbar-expand-lg mobile-nav">
      <div className="navbar-header">
        <div className=" my-15">
          <Link href="/">
            <a>
              <img className="rounded-xl w-20 h-20" src="logo.jpg" alt="Logo" title="Logo" />
             
            </a>
          </Link>
        </div>
        {/* Toggle Button */}
        <Link href="/cart">
        <button  className="cart ml-48">
              <i className="far fa-shopping-basket text-2xl" />
              {/* <span>5</span> */}
            </button>
            </Link>
      </div>
      <div className={`navbar-collapse collapse clearfix ${nav ? "show" : ""}`}>
        <DaskTopMenu />
        <MobileMenu />
      </div>
    </nav>
  );
};


const Header1 = ({user,showDropdown,handleMouseEnter,handleMouseLeave,userData,handleLogout}) => (
  <header className="main-header menu-absolute">
    <div className="header-top-wrap bg-light-green text-white py-10">
      <div className="container-fluid">
        <div className="header-top">
          <div className="row">
            <div className="col-xl-7 col-lg-6">
              <div className="top-left">
                <ul>
                  <li>
                    <i className="far fa-envelope" /> <b>Email Us :</b>{" "}
                    <a href="mailto:info@jvcorganic.com">info@jvcorganic.com</a>
                  </li>
                  {/* <li>
                    <i className="far fa-clock" /> <b>Working Hours :</b> Monday
                    - Friday, 08 am - 05 pm
                  </li> */}
                </ul>
              </div>
            </div>
            <div className="col-xl-5 col-lg-6">
              <div className="top-right text-lg-right">
                <ul>
                  <li>
                    <i className="far fa-phone" /> <b>Call :</b>{" "}
                    <a href="callto:+91 81478-00001">+91 81478-00001</a>
                  </li>
                  <li>
                    <div className="social-style-one">
                      <a href="#">
                        <i className="fab fa-facebook-f" />
                      </a>
                      <a href="#">
                        <i className="fab fa-twitter" />
                      </a>
                      <a href="#">
                        <i className="fab fa-youtube" />
                      </a>
                      <a href="#">
                        <i className="fab fa-instagram" />
                      </a>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    {/*Header-Upper*/}
    <div className="header-upper">
      <div className="container-fluid clearfix">
        <div className="header-inner d-flex align-items-center">
          <div className="logo-outer">
            <div className="logo">
              <Link href="/">
                <a>
                  <img
                    src="logo.jpg"
                    alt="Logo"
                    title="Logo"
                    className="w-16 h-16 rounded-lg"
                  />
                </a>
              </Link>
            </div>
          </div>
          <div className="nav-outer clearfix">
            {/* Main Menu */}
            <Nav />
            {/* Main Menu End*/}
          </div>
          {/* Menu Button */}
          <div className="menu-icons">
            {/* Nav Search */}
            {/* <div className="nav-search py-15">
              <SearchBtn />
            </div> */}
             <Link href="/cart">
            <button  className="cart mr-6">
              <i className="far fa-shopping-basket text-2xl" />
              {/* <span>5</span> */}
            </button>
            </Link>
           
            {!user ? (
          // Show login button if user is not logged in
          <Link href="/login">
          <a className="theme-btn style-two">
            Login
          </a>
        </Link>
        ) : (
          // Show user-circle icon if user is logged in
          <div className="cursor-pointer"  onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}>
          <button className="user w-8 mr-2" >
            <i className="far fa-user-circle text-2xl" />
          </button>
          {showDropdown && (
            <div class="absolute  right-0 w-48 top-4   bg-white shadow-lg rounded-2xl dark:bg-gray-700 ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div
                class="py-1 border-b border-gray-200 dark:border-gray-600"
                role="none"
              >
                <p class="px-4 pt-2 mb-1 font-normal text-black dark:text-black">
                  Signed in as:
                </p>
                <a
                  href="/Profile"
                  class="flex px-4 py-2 text-sm font-semibold text-black border-l-2 border-transparent hover:border-red-600 dark:text-black dark:hover:text-black hover:text-red-600 dark:hover:text-red-600"
                >
                
                  {userData && userData.name ? (
  <a
    href="/Profile"
    className="flex px-4 py-2 text-sm font-semibold text-black border-l-2 border-transparent hover:border-red-600 dark:text-black dark:hover:text-black hover:text-red-600"
  >
    <span className="mr-2">
      {userData.photoURL ? (
        <img
          src={userData.photoURL}
          alt="User Profile"
          className="w-4 h-4 rounded-full cursor-pointer"
        />
      ) : (
        <FaUser className="w-4 h-4 text-black cursor-pointer" />
      )}
    </span>
    {userData.name}
  </a>
) : (
  /* Render a default content or handle the absence of userData.name */
  <span>No user name available</span>
)}

                </a>
              </div>

              <div class="py-1" role="none">
                <a
                  href="/Order-History"
                  class="flex px-4 py-2 text-sm text-black border-l-2 border-transparent dark:hover:border-red-600 rounded-bl-md hover:border-red-600 dark:text-black dark:hover:text-black hover:text-red-600"
                >
                  <span class="mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      class="w-4 h-4 hover:text-red-600 bi bi-bag"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 9h16v11a1 1 0 01-1 1H5a1 1 0 01-1-1V9zm7-6a2 2 0 012 2v2a2 2 0 01-2 2v0a2 2 0 01-2-2V5a2 2 0 012-2zm4 0a2 2 0 012 2v2a2 2 0 01-2 2v0a2 2 0 01-2-2V5a2 2 0 012-2z"
                      ></path>
                    </svg>
                  </span>
                  Our Order
                </a>
              </div>

              <div class="py-1" role="none">
                <button
                  onClick={handleLogout}
                  class="flex px-4 py-2 text-sm text-black border-l-2 border-transparent dark:hover:border-red-600 rounded-bl-md hover:border-red-600 dark:text-black dark:hover:text-black hover:text-red-600"
                >
                  <span class="mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      class="w-4 h-4 hover:text-red-600 bi bi-box-arrow-right"
                      viewBox="0 0 16 16"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"
                      />
                      <path
                        fill-rule="evenodd"
                        d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"
                      />
                    </svg>
                  </span>
                  Logout
                </button>
              </div>
            </div>
          )}
          </div>
         
        )}
            {/* <Link href="/contact">
              <a className="theme-btn">
                Consultations <i className="fas fa-angle-double-right" />
              </a>
            </Link> */}
            {/* menu sidbar */}
            {/* <div className="menu-sidebar" onClick={() => sidebarToggle()}>
              <button>
                <i className="far fa-ellipsis-h" />
                <i className="far fa-ellipsis-h" />
                <i className="far fa-ellipsis-h" />
              </button>
            </div> */}
          </div>
        </div>
      </div>
    </div>
    {/*End Header Upper*/}
  </header>
);

