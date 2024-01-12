import Link from "next/link";
import Layout from "../src/layout/Layout";

import dynamic from "next/dynamic";
import Slider from "react-slick";
import { HomeSlider3 } from "../src/components/HomeSlider";
import { clientLogo } from "../src/sliderProps";

const TrendyProducts = dynamic(
  () => import("../src/components/istotope/TrendyProducts"),
  {
    ssr: false,
  }
);
const PopularProducts = dynamic(
  () => import("../src/components/istotope/PopularProducts"),
  {
    ssr: false,
  }
);
const MunfimCountdown = dynamic(
  () => import("../src/components/MunfimCountdown"),
  {
    ssr: false,
  }
);

const Index3 = ({addToCart}) => {
  return (
    <div >
      <section className="slider-section slider-three">
        <div className="slider-three-active">
          <HomeSlider3 />
        </div>
      </section>
      {/* Slider Section End */}
      {/* Feature Area Start */}
      <section className="feature-three-area pb-10">
        <div className="container-fluid">
          <div className="feature-three-inner">
            <div className="feature-two-item wow fadeInUp delay-0-2s">
              <div className="icon">
                <i className="flaticon-delivery-man" />
              </div>
              <div className="content">
                <h4>
                  <Link href="/service-details">Free Shipping</Link>
                </h4>
                <p>Over $90 For Free Shipping</p>
              </div>
            </div>
            <div className="feature-two-item wow fadeInDown delay-0-4s">
              <div className="icon">
                <i className="flaticon-offer" />
              </div>
              <div className="content">
                <h4>
                  <Link href="/service-details">Return Policy</Link>
                </h4>
                <p>Dedicated Support</p>
              </div>
            </div>
            <div className="feature-two-item wow fadeInUp delay-0-6s">
              <div className="icon">
                <i className="flaticon-24-hours" />
              </div>
              <div className="content">
                <h4>
                  <Link href="/service-details">Online Support</Link>
                </h4>
                <p>24/7 Hours Online Support</p>
              </div>
            </div>
            <div className="feature-two-item wow fadeInDown delay-0-8s">
              <div className="icon">
                <i className="flaticon-quote" />
              </div>
              <div className="content">
                <h4>
                  <Link href="/service-details">Smart Discount</Link>
                </h4>
                <p>Every Product We Provide Discount</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Feature Area End */}
      {/* Offer Banners Start */}
      <section className="offer-banners-two pb-10">
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-xl-4 col-md-6">
              <div
                className="offer-banner-item style-two wow fadeInUp delay-0-2s"
                style={{
                  backgroundImage:
                    "url(assets/images/offers/offer-banner-bg4.jpg)",
                }}
              >
                <div className="content mb-0 ml-auto">
                  <span className="sub-title">100% Fresh</span>
                  <h3>Vegetables</h3>
                  <Link href="/vegetables">
                    <a className="theme-btn style-three">
                      Shop Now <i className="fas fa-angle-double-right" />
                    </a>
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-md-6">
              <div
                className="offer-banner-item style-two wow fadeInUp delay-0-4s"
                style={{
                  backgroundImage:
                    "url(assets/images/offers/offer-banner-bg5.jpg)",
                }}
              >
                <div className="content mb-0">
                  <span className="sub-title">100% Fresh</span>
                  <h3>Fruit</h3>
                  <Link href="/fruits">
                    <a className="theme-btn style-three">
                      Shop Now <i className="fas fa-angle-double-right" />
                    </a>
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-md-6">
              <div
                className="offer-banner-item style-two wow fadeInUp delay-0-4s"
                style={{
                  backgroundImage:
                    "url(assets/images/offers/offer-banner-bg6.jpg)",
                }}
              >
                <div className="content mb-0">
                  <span className="sub-title">100% Fresh</span>
                  <h3>Spices</h3>
                  <Link href="/spices">
                    <a className="theme-btn style-three">
                      Shop Now <i className="fas fa-angle-double-right" />
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Offer Banners End */}
      {/* Product Category Area Start */}
      {/* <section className="product-category-area pb-10">
        <div className="container-fluid">
          <div className="product-category-inner">
            <div className="row justify-content-center">
              <div className="col-xl-3 col-lg-4 col-sm-6">
                <div className="product-category-item wow fadeInUp delay-0-2s">
                  <div className="image">
                    <img
                      src="assets/images/products/product28.png"
                      alt="Product"
                    />
                  </div>
                  <div className="content">
                    <h4>
                      <Link href="/product-details">Organic Fruits</Link>
                    </h4>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-lg-4 col-sm-6">
                <div className="product-category-item wow fadeInUp delay-0-3s">
                  <div className="image">
                    <img
                      src="assets/images/products/product29.png"
                      alt="Product"
                    />
                  </div>
                  <div className="content">
                    <h4>
                      <Link href="/product-details">Organic Vegetables</Link>
                    </h4>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-lg-4 col-sm-6">
                <div className="product-category-item wow fadeInUp delay-0-5s">
                  <div className="image">
                    <img
                      src="assets/images/products/product31.png"
                      alt="Product"
                    />
                  </div>
                  <div className="content">
                    <h4>
                      <Link href="/product-details">Spices</Link>
                    </h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}
      {/* Product Category Area End */}
      {/* Shop Area Start */}
      <section className="shop-area-three rel z-1 py-10">
        <div className="container-fluid">
          <PopularProducts addToCart={addToCart} />
        </div>
      </section>
      {/* Shop Area End */}
      {/* Special Offer Start */}
 
      {/* Special Offer End */}
      {/* Shop Area Start */}
      {/* <section className="shop-area-four rel z-1 pt-10 pb-10">
        <div className="container-fluid">
          <TrendyProducts />
        </div>
      </section> */}
     
    </div>
  );
};
export default Index3;
