import React from 'react'
import Link from "next/link";
const Header1 = () => (
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
                      src="assets/images/logos/logo.png"
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
                <SearchBtn />
              </div> */}
              <button className="cart">
                <i className="far fa-shopping-basket" />
                <span>5</span>
              </button>
              <button className="user">
                <i className="far fa-user-circle" />
              </button>
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

export default Header1