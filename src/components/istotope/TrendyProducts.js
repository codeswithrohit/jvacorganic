import Isotope from "isotope-layout";
import Link from "next/link";
import { Fragment, useEffect, useRef, useState } from "react";
import {firebase} from '../../../Firebase/config'
const PopularProducts = () => {
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
            <span className="sub-title mb-2">Trendy Products</span>
            <h2>Trendy Products</h2>
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
      <div className="row popular-products-active">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          filteredProducts.map((item, index) => (
  <div key={item.id} className="col-xl-3 col-lg-4 col-sm-6 item Fruits bread">
    <Link href={`/Product-Details?id=${item.id}`}>
    <div className="product-item wow fadeInUp delay-0-2s">
      <div className="image">
        <img src={item.frontImage}
                alt={item.productname} />
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
          <Link href={`/Product-Details?id=${item.id}`}>{item.productname}</Link>
        </h5>
        <span >
          <span>₹{item.price}</span>
        </span>
      </div>
    </div>
    </Link>
  </div>
))
)}
</div>
</Fragment>
  );
};
export default PopularProducts;
