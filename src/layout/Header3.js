import React from 'react'
import Link from "next/link";
const Header3 = () => (
    <header className="main-header header-three menu-absolute">
      <div className="header-top-wrap bgc-primary py-10">
        <div className="container-fluid">
          <div className="header-top px-0">
            <ul>
              <li>25% OFF Upcoming Product</li>
              <li>100% Fresh &amp; natural foods</li>
              <li>free shipping over $99</li>
              <li>money back guarantee</li>
              <li>cash on delivery</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="header-middle py-15">
        <div className="container-fluid">
          <div className="header-middle-inner">
            <div className="menu-middle-left">
              <select name="currentcy" id="currentcy">
                <option value="USD">USD</option>
                <option value="BDT">BDT</option>
                <option value="EURO">EURO</option>
              </select>
  
              <select name="language" id="language">
                <option value="English">English</option>
                <option value="Bengali">Bengali</option>
                <option value="Arabic">Arabic</option>
              </select>
  
              <div className="follower">
                <i className="fab fa-facebook" />
                <a href="#">250k+ Followers</a>
              </div>
            </div>
            <div className="logo-outer">
              <div className="logo">
                <Link href="/">
                  <a>
                    <img
                      src="assets/images/logos/logo-two.png"
                      alt="Logo"
                      title="Logo"
                    />
                  </a>
                </Link>
              </div>
            </div>
            {/* Menu Button */}
            <div className="menu-icons">
              {/* Nav Search */}
              {/* <form
                onSubmit={(e) => e.preventDefault()}
                action="#"
                className="nav-search"
              >
                <input
                  type="text"
                  placeholder="Search here"
                  className="searchbox"
                  required=""
                />
                <button type="submit" className="searchbutton far fa-search" />
              </form> */}
              <button className="cart">
                <i className="far fa-shopping-basket" />
                <span>5</span>
              </button>
              <button className="user">
                <i className="far fa-user-circle" />
              </button>
              {/* <button className="heart">
                <i className="far fa-heart" />
              </button> */}
            </div>
          </div>
        </div>
      </div>
      {/*Header-Upper*/}
      <div className="header-upper px-0">
        <div className="container-fluid clearfix">
          <div className="header-inner d-flex align-items-center">
            <div className="nav-outer clearfix">
              {/* Main Menu */}
              <Nav />
              {/* Main Menu End*/}
            </div>
            {/* menu sidbar */}
            <div className="menu-sidebar" onClick={() => sidebarToggle()}>
              <button>
                <i className="far fa-ellipsis-h" />
                <i className="far fa-ellipsis-h" />
                <i className="far fa-ellipsis-h" />
              </button>
            </div>
          </div>
        </div>
      </div>
      {/*End Header Upper*/}
    </header>
  );

export default Header3