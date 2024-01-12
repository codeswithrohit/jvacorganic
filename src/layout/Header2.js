import React from 'react'
import Link from "next/link";
const Header2 = () => (
    <header className="main-header header-two">
      <div className="header-top-wrap">
        <div className="container">
          <div className="header-top bg-light-green text-white py-10">
            <div className="row">
              <div className="col-xl-7 col-lg-6">
                <div className="top-left">
                  <ul>
                    <li>
                      <i className="far fa-envelope" /> <b>Email Us :</b>{" "}
                      <a href="mailto:info@jvcorganic.com">info@jvcorganic.com</a>
                    </li>
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
        <div className="container rel clearfix">
          <div className="header-inner d-flex align-items-center">
            <div className="logo-outer">
              <div className="logo">
                <Link href="/">
                  <a>
                    <img
                      src="assets/images/logos/logo.png"
                      alt="Logo"
                      title="Logo"
                    />
                    <img
                      src="assets/images/logos/logo-white.png"
                      alt="Logo"
                      title="Logo"
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
                <button className="far fa-search" />
                <form
                  onSubmit={(e) => e.preventDefault()}
                  action="#"
                  className="hide"
                >
                  <input
                    type="text"
                    placeholder="Search"
                    className="searchbox"
                    required=""
                  />
                  <button type="submit" className="searchbutton far fa-search" />
                </form>
              </div> */}
              <button className="cart">
                <i className="far fa-shopping-basket" />
              </button>
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

export default Header2