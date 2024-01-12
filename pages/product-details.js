import Link from "next/link";
import { Nav, Tab } from "react-bootstrap";
import Slider from "react-slick";
import PageBanner from "../src/components/PageBanner";
import Layout from "../src/layout/Layout";
import { productActiveTwo } from "../src/sliderProps";
import React, { useState, useEffect } from "react";
import { firebase } from "../Firebase/config";
import "firebase/firestore";
import "firebase/storage";
import { FaCartPlus } from "react-icons/fa";
import { useRouter } from "next/router";
const ProductDetails = ({ addToCart, cart, removeFromCart, clearCart, subTotal,bookNow }) => {
  const router = useRouter();
  const [productdata, setProductData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");

    const db = firebase.firestore();
    const productRef = db.collection("Product").doc(id);

    productRef.get().then((doc) => {
      if (doc.exists) {
        setProductData(doc.data());
      } else {
        console.log("Document not found!");
      }
      setIsLoading(false);
    });
  }, []);
  return (
    <Layout>
      {/* <PageBanner pageName={"Product Details"} /> */}
      {isLoading ? (
         <div className="fixed top-0 left-0 z-50 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50">
         <div className="text-white text-2xl">Loading...</div>
       </div>
      ) : (
        <div>
      <section className="product-details-area pt-130 rpt-100">
        <div className="container">
        <section class="overflow-hidden bg-white py-11 font-poppins dark:bg-gray-800">
        <div class="max-w-6xl px-4 py-4 mx-auto lg:py-8 md:px-6">
            <div class="flex flex-wrap -mx-4">
                <div class="w-full mb-8 md:w-1/2 md:mb-0">
                    <div class="sticky top-0 z-50 overflow-hidden ">
                        <div class="relative mb-6 lg:mb-10 lg:h-2/4 ">
                         
                       
                        {productdata.photos && productdata.photos.length > 0 ? (
                        <img
                        class="object-cover w-96 lg:h-full "
                          src={
                            productdata.frontImage
                              ? productdata.frontImage
                              : productdata.photos[0]
                          }
                          alt="Product Image"
                        />
                      ) : (
                        <img
                        class="object-cover w-96 lg:h-full "
                          src={productdata.frontImage}
                          alt="Product Image"
                        />
                      )}
                       </div>
                        {/* <div class="flex-wrap hidden md:flex ">
                            <div class="w-1/2 p-2 sm:w-1/4">
                                <a href="#" class="block border border-blue-300 hover:border-blue-300">
                                    <img src="https://i.postimg.cc/6qcPhTQg/R-18.png" alt=""
                                        class="object-cover w-full lg:h-20"/>
                                </a>
                            </div>
                            <div class="w-1/2 p-2 sm:w-1/4">
                                <a href="#" class="block border border-transparent hover:border-blue-300">
                                    <img src="https://i.postimg.cc/6qcPhTQg/R-18.png" alt=""
                                        class="object-cover w-full lg:h-20"/>
                                </a>
                            </div>
                            <div class="w-1/2 p-2 sm:w-1/4">
                                <a href="#" class="block border border-transparent hover:border-blue-300">
                                    <img src="https://i.postimg.cc/6qcPhTQg/R-18.png" alt=""
                                        class="object-cover w-full lg:h-20"/>
                                </a>
                            </div>
                            <div class="w-1/2 p-2 sm:w-1/4">
                                <a href="#" class="block border border-transparent hover:border-blue-300">
                                    <img src="https://i.postimg.cc/6qcPhTQg/R-18.png" alt=""
                                        class="object-cover w-full lg:h-20"/>
                                </a>
                            </div>
                        </div> */}
                        <div class="px-6 pb-6 mt-6 border-t border-gray-300 dark:border-gray-400 ">
                            <div class="flex flex-wrap items-center mt-6">
                                <span class="mr-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                        class="w-4 h-4 text-gray-700 dark:text-gray-400 bi bi-truck"
                                        viewBox="0 0 16 16">
                                        <path
                                            d="M0 3.5A1.5 1.5 0 0 1 1.5 2h9A1.5 1.5 0 0 1 12 3.5V5h1.02a1.5 1.5 0 0 1 1.17.563l1.481 1.85a1.5 1.5 0 0 1 .329.938V10.5a1.5 1.5 0 0 1-1.5 1.5H14a2 2 0 1 1-4 0H5a2 2 0 1 1-3.998-.085A1.5 1.5 0 0 1 0 10.5v-7zm1.294 7.456A1.999 1.999 0 0 1 4.732 11h5.536a2.01 2.01 0 0 1 .732-.732V3.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .294.456zM12 10a2 2 0 0 1 1.732 1h.768a.5.5 0 0 0 .5-.5V8.35a.5.5 0 0 0-.11-.312l-1.48-1.85A.5.5 0 0 0 13.02 6H12v4zm-9 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm9 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z">
                                        </path>
                                    </svg>
                                </span>
                                <h2 class="text-lg font-bold text-gray-700 dark:text-gray-400">Free Shipping</h2>
                            </div>
                            {/* <div class="mt-2 px-7">
                                <a class="text-sm text-blue-400 dark:text-blue-200" href="#">Get delivery dates</a>
                            </div> */}
                        </div>
                    </div>
                </div>
                <div class="w-full px-4 md:w-1/2 ">
                    <div class="lg:pl-20">
                        <div class="mb-8 ">
                            <h2 class="max-w-xl mb-6 text-2xl font-bold dark:text-gray-400 md:text-4xl">
                              {productdata.productname}</h2>
                              <div className="flex">
                            <p class="inline-block mb-6 text-4xl font-bold text-gray-700 dark:text-gray-400 ">
                                <span>₹ {productdata.price}</span>
                            
                            </p>
                            <p class="inline-block mb-6 ml-2 text-4xl font-bold text-gray-700 dark:text-gray-400 ">
                                <span> {productdata.pricecat}</span>
                            
                            </p>
                            </div>
                            {/* <p class="max-w-md text-gray-700 dark:text-gray-400">
                                Lorem ispum dor amet Lorem ispum dor amet Lorem ispum dor amet Lorem ispum dor amet
                                Lorem ispum dor amet Lorem ispum dor amet Lorem ispum dor amet Lorem ispum dor amet
                            </p> */}
                        </div>
                        {/* <div class="mb-8">
                            <h2
                                class="w-16 pb-1 mb-4 text-2xl font-bold border-b border-blue-300 dark:text-gray-400 dark:border-gray-600">
                                Colors</h2>
                            <div class="flex flex-wrap -mx-2 -mb-2">
                                <button class="p-1 mb-2 mr-3 ">
                                    <div class="w-6 h-6 rounded-full bg-stone-400"></div>
                                </button>
                                <button class="p-1 mb-2 mr-3 ">
                                    <div class="w-6 h-6 bg-gray-700 rounded-full"></div>
                                </button>
                                <button class="p-1 mb-2 ">
                                    <div class="w-6 h-6 bg-blue-200 rounded-full"></div>
                                </button>
                            </div>
                        </div>
                        <div class="mb-8 ">
                            <h2
                                class="w-16 pb-1 mb-4 text-xl font-semibold border-b border-blue-300 dark:border-gray-600 dark:text-gray-400">
                                RAM</h2>
                            <div>
                                <div class="flex flex-wrap -mb-2">
                                    <button
                                        class="px-4 py-2 mb-2 mr-4 font-semibold border rounded-md hover:border-blue-400 dark:border-gray-400 hover:text-blue-600 dark:hover:border-gray-300 dark:text-gray-400">
                                        8 GB
                                    </button>
                                    <button
                                        class="px-4 py-2 mb-2 mr-4 font-semibold border rounded-md hover:border-blue-400 hover:text-blue-600 dark:border-gray-400 dark:hover:border-gray-300 dark:text-gray-400">
                                        16 GB
                                    </button>
                                    <button
                                        class="px-4 py-2 mb-2 font-semibold border rounded-md hover:border-blue-400 hover:text-blue-600 dark:border-gray-400 dark:hover:border-gray-300 dark:text-gray-400">
                                        1 TB
                                    </button>
                                </div>
                            </div>
                        </div> */}
                        {/* <div class="mb-8">
                            <h2
                                class="w-16 pb-1 mb-6 text-xl font-semibold border-b border-blue-300 dark:border-gray-600 dark:text-gray-400">
                                Storage</h2>
                            <div>
                                <div class="flex flex-wrap -mx-2 -mb-2">
                                    <button
                                        class="px-4 py-2 mb-2 mr-4 font-semibold border rounded-md hover:border-blue-400 dark:border-gray-400 hover:text-blue-600 dark:hover:border-gray-300 dark:text-gray-400">
                                        256 GB
                                    </button>
                                    <button
                                        class="px-4 py-2 mb-2 mr-4 font-semibold border rounded-md hover:border-blue-400 hover:text-blue-600 dark:border-gray-400 dark:hover:border-gray-300 dark:text-gray-400">
                                        112 GB
                                    </button>
                                    <button
                                        class="px-4 py-2 mb-2 mr-2 font-semibold border rounded-md hover:border-blue-400 hover:text-blue-600 dark:border-gray-400 dark:hover:border-gray-300 dark:text-gray-400">
                                        1 TB
                                    </button>
                                </div>
                            </div>
                        </div> */}
                        {/* <div class="w-32 mb-8 ">
                            <label for=""
                                class="w-full pb-1 text-xl font-semibold text-gray-700 border-b border-blue-300 dark:border-gray-600 dark:text-gray-400">Quantity</label>
                            <div class="relative flex flex-row w-full h-10 mt-6 bg-transparent rounded-lg">
                                <button onClick={() => {
                                  removeFromCart(
                                    productdata.id,
                                    1,
                                    productdata.price,
                                    productdata.productname
                                  );
                                }}
                                    class="w-20 h-full text-gray-600 bg-gray-300 rounded-l outline-none cursor-pointer dark:hover:bg-gray-700 dark:text-gray-400 hover:text-gray-700 dark:bg-gray-900 hover:bg-gray-400">
                                    <span class="m-auto text-2xl font-thin">-</span>
                                </button>
                                <input type="number" value= {productdata.qty}
                                    class="flex items-center w-full font-semibold text-center text-gray-700 placeholder-gray-700 bg-gray-300 outline-none dark:text-gray-400 dark:placeholder-gray-400 dark:bg-gray-900 focus:outline-none text-md hover:text-black"
                                    placeholder="1"/>
                                <button  onClick={() => {
                                  addToCart(
                                    productdata.id,
                                    1,
                                    productdata.price,
                                    productdata.productname
                                  );
                                }}
                                    class="w-20 h-full text-gray-600 bg-gray-300 rounded-r outline-none cursor-pointer dark:hover:bg-gray-700 dark:text-gray-400 dark:bg-gray-900 hover:text-gray-700 hover:bg-gray-400">
                                    <span class="m-auto text-2xl font-thin">+</span>
                                </button>
                            </div>
                        </div> */}
                        <div class="flex flex-wrap items-center gap-4">
                            <button  onClick={() =>
                              addToCart(
                                productdata.id,
                                1,
                                productdata.price,
                                productdata.productname,
                                productdata.frontImage,
                                productdata.pricecat,
                              )
                            }
                                class="w-full p-4 bg-blue-500 rounded-md lg:w-2/5 dark:text-gray-200 text-gray-50 hover:bg-blue-600 dark:bg-blue-500 dark:hover:bg-blue-700">
                                Add to cart</button>
                            <button
                             onClick={() =>
                              bookNow(
                                productdata.id,
                                1,
                                productdata.price,
                                productdata.productname,
                                productdata.frontImage,
                                productdata.pricecat,
                              )
                            }
                                class="flex items-center justify-center w-full p-4 text-blue-500 border border-blue-500 rounded-md lg:w-2/5 dark:text-gray-200 dark:border-blue-600 hover:bg-blue-600 hover:border-blue-600 hover:text-gray-100 dark:bg-blue-500 dark:hover:bg-blue-700 dark:hover:border-blue-700 dark:hover:text-gray-300">
                                Buy Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
          <Tab.Container defaultActiveKey={"details"}>
            <Nav className="nav nav-tabs product-information-tab pt-35 mb-25">
              <li>
                <Nav.Link
                  eventKey={"details"}
                  href="#details"
                  data-toggle="tab"
                >
                  Description
                </Nav.Link>
              </li>
              {/* <li>
                <Nav.Link
                  eventKey={"information"}
                  href="#information"
                  data-toggle="tab"
                >
                  Additional information
                </Nav.Link>
              </li> */}
              {/* <li>
                <Nav.Link eventKey={"review"} href="#review" data-toggle="tab">
                  Review (05)
                </Nav.Link>
              </li> */}
            </Nav>
            <Tab.Content className="tab-content wow fadeInUp delay-0-2s mb-20">
              <Tab.Pane className="tab-pane" eventKey="details">
                <p style={{ whiteSpace: 'pre-line' }} className="text-justify">
                {productdata.description}
                </p>
              </Tab.Pane>
              <Tab.Pane className="tab-pane" eventKey="information">
                <p>
                  inventore veritatis et quasi architecto beatae vitae dicta
                  sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit
                  aspernatur aut odit aut fugit, sed quia consequuntur magni
                  dolores eos qui ratione voluptatem sequi nesciunt. Neque porro
                  quisquam est, qui dolorem ipsum quia dolor sit amet,
                  consectetur, adipisci velit, sed quia non numquam
                </p>
                <ul className="list-style-one mt-25 mb-25">
                  <li>Strong lens for long distance surveillance.</li>
                  <li>WIFI technology can view and view the Internet</li>
                  <li>Wide Angle and Long Length</li>
                  <li>Smart zooming point</li>
                  <li>HD quality video output.</li>
                  <li>Smart Alarming System</li>
                  <li>Power system 12 volts (without adapter)</li>
                </ul>
                <p>
                  Now wherever you are, wherever you are, you can easily monitor
                  your CCTV videos through your mobile, tab, laptop or PC. With
                  the wireless camera, you can view the camera from your mobile
                  or computer to the right-left 0 to 360-degree video. Cover the
                  flower room with a camera.
                </p>
              </Tab.Pane>
              {/* <Tab.Pane className="tab-pane" eventKey="review">
                <ul className="comment-list">
                  <li>
                    <div className="comment-body">
                      <div className="author-thumb">
                        <img
                          src="assets/images/products/review-author1.jpg"
                          alt="Author"
                        />
                      </div>
                      <div className="comment-content">
                        <div className="name-date">
                          <h6>John F. Medina</h6>
                          <span className="comment-date">25 Feb 2022</span>
                          <div className="ratting">
                            <i className="fas fa-star" />
                            <i className="fas fa-star" />
                            <i className="fas fa-star" />
                            <i className="fas fa-star" />
                            <i className="fas fa-star" />
                          </div>
                        </div>
                        <p>
                          Quis autem vel eum iure reprehenderit quin voluptate
                          velit esseeso quam nihile molestiae consequatur
                          veillum quolore
                        </p>
                        <a href="#" className="reply-link">
                          Reply <i className="fas fa-long-arrow-alt-right" />
                        </a>
                      </div>
                    </div>
                    <ul className="children">
                      <li>
                        <div className="comment-body">
                          <div className="author-thumb">
                            <img
                              src="assets/images/products/review-author2.jpg"
                              alt="Author"
                            />
                          </div>
                          <div className="comment-content">
                            <div className="name-date">
                              <h6>Somalia D. Silva</h6>
                              <span className="comment-date">25 Feb 2022</span>
                              <div className="ratting">
                                <i className="fas fa-star" />
                                <i className="fas fa-star" />
                                <i className="fas fa-star" />
                                <i className="fas fa-star" />
                                <i className="fas fa-star" />
                              </div>
                            </div>
                            <p>
                              Quis autem vel eum iure reprehenderit quin
                              voluptate velit esseeso quam nihile molestiae
                              consequatur veillum quolore
                            </p>
                            <a href="#" className="reply-link">
                              Reply{" "}
                              <i className="fas fa-long-arrow-alt-right" />
                            </a>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <div className="comment-body">
                      <div className="author-thumb">
                        <img
                          src="assets/images/products/review-author3.jpg"
                          alt="Author"
                        />
                      </div>
                      <div className="comment-content">
                        <div className="name-date">
                          <h6>Roger A. Torrence</h6>
                          <span className="comment-date">25 Feb 2022</span>
                          <div className="ratting">
                            <i className="fas fa-star" />
                            <i className="fas fa-star" />
                            <i className="fas fa-star" />
                            <i className="fas fa-star" />
                            <i className="fas fa-star" />
                          </div>
                        </div>
                        <p>
                          Quis autem vel eum iure reprehenderit quin voluptate
                          velit esseeso quam nihile molestiae consequatur
                          veillum quolore
                        </p>
                        <a href="#" className="reply-link">
                          Reply <i className="fas fa-long-arrow-alt-right" />
                        </a>
                      </div>
                    </div>
                  </li>
                </ul>
              </Tab.Pane> */}
            </Tab.Content>
          </Tab.Container>
        </div>
      </section>
      {/* Product Details End */}
      {/* Revidew Form Area Start */}
      {/* <div className="review-form-area pt-65">
        <div className="container">
          <form
            onSubmit={(e) => e.preventDefault()}
            id="review-form"
            className="review-form wow fadeInUp delay-0-2s"
            name="comment-form"
            action="#"
            method="post"
          >
            <div className="section-title mb-15">
              <h3>Leave a Comments</h3>
            </div>
            <div className="ratting mb-40">
              <span>Your Rating</span>
              <i className="fas fa-star" />
              <i className="fas fa-star" />
              <i className="fas fa-star" />
              <i className="fas fa-star" />
              <i className="fas fa-star" />
            </div>
            <div className="row">
              <div className="col-md-4">
                <div className="form-group">
                  <input
                    type="text"
                    id="full-name"
                    name="full-name"
                    className="form-control"
                    defaultValue=""
                    placeholder="Full Name"
                    required=""
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <input
                    type="text"
                    id="number"
                    name="number"
                    className="form-control"
                    defaultValue=""
                    placeholder="Phone Number"
                    required=""
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-control"
                    defaultValue=""
                    placeholder="Email Address"
                    required=""
                  />
                </div>
              </div>
              <div className="col-md-12">
                <div className="form-group">
                  <textarea
                    name="message"
                    id="message"
                    className="form-control"
                    rows={4}
                    placeholder="Write Message"
                    required=""
                    defaultValue={""}
                  />
                </div>
              </div>
              <div className="col-md-12">
                <div className="form-group mb-0">
                  <button type="submit" className="theme-btn">
                    Send Reviews
                    <i className="fas fa-angle-double-right" />
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div> */}
      {/* Revidew Form Area End */}
      {/* Related Products Start */}
      {/* <section className="related-product rel z-1 pt-125 rpt-95 pb-130 rpb-100">
        <div className="container">
          <div className="section-title text-center mb-60">
            <h3>Related Products</h3>
          </div>
          <Slider {...productActiveTwo} className="product-active-two">
            <div className="product-item wow fadeInUp delay-0-2s">
              <div className="image">
                <img src="assets/images/products/product8.png" alt="Product" />
              </div>
              <div className="content">
                <div className="ratting">
                  <i className="fas fa-star" />
                  <i className="fas fa-star" />
                  <i className="fas fa-star" />
                  <i className="fas fa-star" />
                  <i className="fas fa-star" />
                </div>
                <h5>
                  <Link href="/product-details">Oragic Orange</Link>
                </h5>
                <span className="price">
                  <span>85</span>
                </span>
              </div>
            </div>
            <div className="product-item wow fadeInUp delay-0-4s">
              <span className="offer">20 Off</span>
              <div className="image">
                <img src="assets/images/products/product10.png" alt="Product" />
              </div>
              <div className="content">
                <div className="ratting">
                  <i className="fas fa-star" />
                  <i className="fas fa-star" />
                  <i className="fas fa-star" />
                  <i className="fas fa-star" />
                  <i className="fas fa-star" />
                </div>
                <h5>
                  <Link href="/product-details">Organic Brocolli</Link>
                </h5>
                <span className="price">
                  <del>25</del>
                  <span>18</span>
                </span>
              </div>
            </div>
            <div className="product-item wow fadeInUp delay-0-6s">
              <div className="image">
                <img src="assets/images/products/product11.png" alt="Product" />
              </div>
              <div className="content">
                <div className="ratting">
                  <i className="fas fa-star" />
                  <i className="fas fa-star" />
                  <i className="fas fa-star" />
                  <i className="fas fa-star" />
                  <i className="fas fa-star" />
                </div>
                <h5>
                  <Link href="/product-details">Fresh Carrots</Link>
                </h5>
                <span className="price">
                  <del>55</del>
                  <span>36</span>
                </span>
              </div>
            </div>
            <div className="product-item wow fadeInUp delay-0-8s">
              <span className="offer bg-red">sale</span>
              <div className="image">
                <img src="assets/images/products/product1.png" alt="Product" />
              </div>
              <div className="content">
                <div className="ratting">
                  <i className="fas fa-star" />
                  <i className="fas fa-star" />
                  <i className="fas fa-star" />
                  <i className="fas fa-star" />
                  <i className="fas fa-star" />
                </div>
                <h5>
                  <Link href="/product-details">Organic Brocolli</Link>
                </h5>
                <span className="price">
                  <span>205</span>
                </span>
              </div>
            </div>
            <div className="product-item wow fadeInUp delay-0-2s">
              <div className="image">
                <img src="assets/images/products/product9.png" alt="Product" />
              </div>
              <div className="content">
                <div className="ratting">
                  <i className="fas fa-star" />
                  <i className="fas fa-star" />
                  <i className="fas fa-star" />
                  <i className="fas fa-star" />
                  <i className="fas fa-star" />
                </div>
                <h5>
                  <Link href="/product-details">Fresh Carrots</Link>
                </h5>
                <span className="price">
                  <del>55</del>
                  <span>36</span>
                </span>
              </div>
            </div>
          </Slider>
        </div>
      </section> */}
      </div>
      )}
    </Layout>
  );
};
export default ProductDetails;
