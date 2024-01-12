import Isotope from "isotope-layout";
import Link from "next/link";
import { Fragment, useEffect, useRef, useState } from "react";
import {firebase} from '../../../Firebase/config'
const PopularProducts = ({addToCart}) => {
  const [productdata, setProductData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filterKey, setFilterKey] = useState("*");

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(() => {
      const db = firebase.firestore();
      const PrasadamsRef = db.collection("Product");

      PrasadamsRef.get()
        .then((querySnapshot) => {
          const PrasadamData = [];
          querySnapshot.forEach((doc) => {
            PrasadamData.push({ ...doc.data(), id: doc.id });
          });

          setProductData(PrasadamData);
          setIsLoading(false);
          setFilteredProducts(PrasadamData); // Initially set filteredProducts with all data
        })
        .catch((error) => {
          console.error("Error getting documents: ", error);
          setIsLoading(false);
        });
    });

    return () => unsubscribe();
  }, []);
console.log(productdata)
  useEffect(() => {
    // Filter products based on the selected key
    if (filterKey === "*") {
      setFilteredProducts(productdata);
    } else {
      const filtered = productdata.filter((item) => item.categories === filterKey);
      setFilteredProducts(filtered);
    }
  }, [filterKey, productdata]); // Update filteredProducts when filterKey or productdata changes

  const handleFilterKeyChange = (key) => () => { // <- Wrap in arrow function
    setFilterKey(key);
    if (key === "*") {
      setFilteredProducts(productdata);
    } else {
      const filtered = productdata.filter((item) => item.categories === key);
      setFilteredProducts(filtered);
    }
  };

  const activeBtn = (value) => (value === filterKey ? "current" : "");


  return (
    <Fragment>
      <div className="row align-items-center pb-30">
        <div className="col-lg-6 wow fadeInUp delay-0-2s">
          <div className="section-title mb-2">
            <span className="sub-title mb-2">Popular Products</span>
            <h2>Popular Products</h2>
          </div>
        </div>
        <div className="col-lg-6 text-lg-right wow fadeInUp delay-0-4s">
          <ul className="popular-products-filter filter-btns-one mb-2">
            <li
              data-filter="*"
              className={`c-pointer ${activeBtn("*")}`}
              onClick={handleFilterKeyChange("*")}
            >
              Show All
            </li>
            <li
              data-filter=".Vegetables"
              className={`c-pointer ${activeBtn("Vegetables")}`}
              onClick={handleFilterKeyChange("Vegetables")}
            >
             Vegetables
            </li>
            <li
              data-filter=".Fruits"
              className={`c-pointer ${activeBtn("Fruits")}`}
              onClick={handleFilterKeyChange("Fruits")}
            >
              Fruits
            </li>
            <li
              data-filter=".Spices"
              className={`c-pointer ${activeBtn("Spices")}`}
              onClick={handleFilterKeyChange("Spices")}
            >
              Spices
            </li>
            
          </ul>
        </div>
      </div>
      <div className="popular-products-active">
  {isLoading ? (
    <p>Loading...</p>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {filteredProducts.map((item, index) => (
        <div key={item.id} className="p-4 bg-white dark:white shadow rounded-xl">
          <div className="overflow-hidden">
            <img
              className="object-contain w-full h-64 transition-transform transform hover:scale-105"
              src={item.frontImage}
              alt="Product"
            />
          </div>

          <a href="#" className="block text-center">
            <h3 className="mb-2 text-lg font-semibold dark:text-white">{item.productname}</h3>
          </a>
          <div className="flex justify-center">
          <p className="text-lg font-semibold text-teal-500 dark:text-teal-300 mb-1 text-center">₹{item.price}</p>
          <p className="text-lg ml-2 font-semibold text-teal-500 dark:text-teal-300 mb-1 text-center">{item.pricecat}</p>
          </div>
          <div className="flex justify-between mt-3">
            <button
              onClick={() =>
                addToCart(
                  item.id,
                  1,
                  item.price,
                  item.productname,
                  item.frontImage
                )
              }
              className="flex-1 mr-2 text-sm text-white transition-all bg-teal-500 hover:bg-teal-600 rounded-xl py-2 px-4"
            >
              Add To Cart
            </button>
            <a
              href={`/product-details?id=${item.id}`}
              className="flex-1 mr-2 text-sm text-white text-center transition-all bg-teal-500 hover:bg-teal-600 rounded-xl py-2 px-4"
            >
              View Products
            </a>
          </div>
        </div>
      ))}
    </div>
  )}
</div>

</Fragment>
  );
};
export default PopularProducts;
