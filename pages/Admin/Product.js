/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, Prasadamef, useRef } from "react";
import { firebase } from "../../Firebase/config";
import { useRouter } from "next/router";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminNavbar from "../../src/components/AdminNavbar";

const Prasadam = () => {
  const router = useRouter(); // Access the router

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

  const [PrasadamData, setPrasadamData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const [formData, setFormData] = useState({
    productname: "",
    price: "",
    pricecat: "",
    cateories: "",
    tags: "",
    description: "",
    frontImage: "",
    productcategories:"",
  });

  const [showAllInputFormats, setShowAllInputFormats] = useState(false);
  const handleShowAllInputFormats = () => {
    setShowAllInputFormats(true);
  };

  const handleCloseAllInputFormats = () => {
    setShowAllInputFormats(false);
  };
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChanges = (event) => {
    const { name, value } = event.target;
  
    // Handle select inputs separately
    if (name === "categories" || name === "productcategories") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };
  const handleFileChange = (e) => {
    const { name, files } = e.target;

    if (name === "frontImage") {
      setFormData({ ...formData, [name]: files[0] });
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const db = firebase.firestore();
      const storage = firebase.storage();

      let frontImageUrl = "";
      if (formData.frontImage) {
        const frontImageFile = formData.frontImage;
        const storageRef = storage.ref();
        const frontImageRef = storageRef.child(frontImageFile.name);
        await frontImageRef.put(frontImageFile);
        frontImageUrl = await frontImageRef.getDownloadURL();
      }

      const dataToUpload = { ...formData, frontImage: frontImageUrl };
      await db.collection("Product").add(dataToUpload);
      toast.success("Data uploaded successfully!");
      router.reload();
    } catch (error) {
      console.error("Error uploading data: ", error);
      toast.error("Error uploading data. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // New state to manage pop-up visibility and selected Prasadam's data
  const [showPopup, setShowPopup] = useState(false);
  const [selectedPrasadam, setSelectedPrasadam] = useState(null);
  const [editedPrasadam, setEditedPrasadam] = useState(null);

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

          setPrasadamData(PrasadamData);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error getting documents: ", error);
          setIsLoading(false);
        });
    });

    return () => unsubscribe();
  }, [router]);

  // Function to handle showing E details
  const handleEditDetails = (Prasadam) => {
    setSelectedPrasadam(Prasadam);
    setEditedPrasadam({ ...Prasadam });
    setShowPopup(true);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditedPrasadam((prevPrasadam) => ({
      ...prevPrasadam,
      [name]: value,
    }));
  };

  const handleDeleteImage = async () => {
    try {
      const storage = firebase.storage();
      const imageRef = storage.refFromURL(editedPrasadam.frontImage);
      await imageRef.delete();
      setEditedPrasadam({ ...editedPrasadam, frontImage: "" });
      toast.success("Image deleted successfully!");
    } catch (error) {
      console.error("Error deleting image: ", error);
      toast.error("Error deleting image. Please try again.");
    }
  };

  const handleReplaceImage = async (e) => {
    const { files } = e.target;
    if (files.length === 0) return;

    const storage = firebase.storage();
    const storageRef = storage.ref();
    const frontImageFile = files[0];
    const frontImageRef = storageRef.child(frontImageFile.name);

    try {
      await frontImageRef.put(frontImageFile);
      const frontImageUrl = await frontImageRef.getDownloadURL();
      setEditedPrasadam({ ...editedPrasadam, frontImage: frontImageUrl });
      toast.success("New image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading new image: ", error);
      toast.error("Error uploading new image. Please try again.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (editedPrasadam) {
        const db = firebase.firestore();
        const PrasadamRef = db.collection("Product").doc(editedPrasadam.id);
        await PrasadamRef.update({
          productname: editedPrasadam.productname,
          price: editedPrasadam.price,
          pricecat: editedPrasadam.pricecat,
          cateories: editedPrasadam.cateories,
          tags: editedPrasadam.tags,
          description: editedPrasadam.description,
          frontImage: editedPrasadam.frontImage,
          productcategories: editedPrasadam.productcategories,
        });
        setShowPopup(false);
        setEditedPrasadam(null);
        toast.success("Changes saved successfully!");
        router.reload();
      }
    } catch (error) {
      console.error("Error saving changes:", error);
      toast.error("An error occurred while saving changes.");
    }
  };

  // Function to handle closing the pop-up
  const handleClosePopup = () => {
    setSelectedPrasadam(null);
    setShowPopup(false);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageData = PrasadamData.slice(startIndex, endIndex);

  const handlePaginationClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Calculate total number of pages
  const totalPages = Math.ceil(PrasadamData.length / itemsPerPage);

  const handleDelete = async (id) => {
    try {
      const db = firebase.firestore();
      await db.collection("Product").doc(id).delete();
      const updatedData = PrasadamData.filter((item) => item.id !== id);
      setPrasadamData(updatedData);
      toast.success("Deletion successful!", {
        position: toast.POSITION.TOP_CENTER,
      });
    } catch (error) {
      console.error("Error deleting document: ", error);
      toast.error("Deletion failed. Please try again.", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };

  return (
    <div className="m-auto min-h-screen bg-white dark:bg-gray-900">
      <AdminNavbar />
      <section className="bg-white lg:ml-64  dark:bg-gray-900">
        <div className="container px-6 py-10 mx-auto">
          {showAllInputFormats ? (
            <div>
              <form
                onSubmit={handleFormSubmit}
                className="max-w-2xl mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
              >
                <button
                  onClick={handleCloseAllInputFormats}
                  className="bg-red-500 rounded-xl p-4 text-white mb-4"
                >
                  Close Form
                </button>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label
                      className="block text-black text-sm font-bold mb-2"
                      htmlFor="frontImage"
                    >
                      Upload Image
                    </label>
                    <input
                      type="file"
                      name="frontImage"
                      onChange={handleFileChange}
                      required
                      className="appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <input
                      type="text"
                      name="productname"
                      placeholder="Product Name"
                      onChange={handleInputChanges}
                      required
                      className="appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      name="price"
                      placeholder="Enter price"
                      onChange={handleInputChanges}
                      className="appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
  <select
    name="cateories"
    onChange={handleInputChanges}
    required
    className="appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
  >
    <option value="" disabled selected>Select a category</option>
    <option value="Vegetables">Vegetables</option>
    <option value="Fruits">Fruits</option>
    <option value="Spices">Spices</option>
    {/* Add more options as needed */}
  </select>
</div>
                <div>
  <select
    name="pricecat"
    onChange={handleInputChanges}
    required
    className="appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
  >
    <option value="" disabled selected>Select a Price Category</option>
    <option value="Per Kg">Per Kg</option>
    <option value="Bunch 200-250 gm ">Bunch 200-250 gm </option>
    {/* Add more options as needed */}
  </select>
</div>
<div>
  <select
    name="productcategories"
    onChange={handleInputChanges}
    required
    className="appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
  >
    <option value="" disabled selected>Select a Trendy or Not</option>
    <option value="Normal">Normal</option>
    <option value="Trendy">Trendy</option>
    {/* Add more options as needed */}
  </select>
</div>

                  <div>
                    <input
                      type="text"
                      name="tags"
                      placeholder="Enter Tag"
                      onChange={handleInputChanges}
                      required
                      className="appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap -mx-3 mb-6">
                  <div className="w-full px-3">
                    <textarea
                      name="description"
                      placeholder="Description"
                      onChange={handleInputChanges}
                      required
                      className="appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
                      style={{ width: "100%", height: "150px" }}
                    ></textarea>
                  </div>
                </div>
                {/* Add similar grid layouts for the remaining input fields */}
                {/* ... */}
                <div className="flex items-center justify-center mt-4">
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            // Display the add PG Detail button when isEditing is false and showAllInputFormats is false
            <button
              onClick={handleShowAllInputFormats}
              className="w-full p-2 bg-blue-500 text-white rounded-md"
            >
              Add Prasadam
            </button>
          )}

          <div className="grid grid-cols-1 gap-8 mt-8 xl:mt-16 md:grid-cols-2 xl:grid-cols-3">
            {isLoading ? (
              <h1>Loading</h1>
            ) : (
              PrasadamData.map((Prasadam, idx) => (
                <div
                  key={idx}
                  className="max-w-sm rounded overflow-hidden shadow-lg m-4"
                >
                  <div className="px-6 py-4">
                    <img
                      className="w-full h-40 object-cover"
                      src={Prasadam.frontImage}
                      alt={Prasadam.productname}
                    />
                    <div className="font-bold text-xl mb-2">
                      {Prasadam.productname}
                    </div>
                    <p className="text-black text-base">
                      Price: {Prasadam.price}
                    </p>
                    <p className="text-black text-xs">{Prasadam.cateories}</p>
                    <div className="flex justify-between mt-4">
                      <button
                        onClick={() => handleDelete(Prasadam.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-md text-xs focus:outline-none"
                      >
                        Delete
                      </button>
                      {/* You can add an edit functionality or link to an edit page */}
                      {/* <Link href={`/edit/${Prasadam.id}`}> */}
                      {/*   <a className="bg-blue-500 text-white px-3 py-1 rounded-md text-xs focus:outline-none">Edit</a> */}
                      {/* </Link> */}
                      <button
                        onClick={() => handleEditDetails(Prasadam)}
                        className="bg-blue-500 text-white px-3 py-1 rounded-md text-xs focus:outline-none"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="flex justify-center mt-8">
            <div className="flex space-x-2">
              {/* Back Button */}
              <button
                onClick={() => handlePaginationClick(currentPage - 1)}
                className={`px-4 py-2 text-sm text-white font-medium bg-red-300 rounded-md ${
                  currentPage === 1 ? "bg-red-400 cursor-not-allowed" : ""
                }`}
                disabled={currentPage === 1}
              >
                <FiChevronLeft className="inline-block mr-1" /> Previous
              </button>

              {/* Page Buttons */}
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  onClick={() => handlePaginationClick(index + 1)}
                  className={`px-4 py-2 text-sm text-white font-medium bg-red-300 rounded-md ${
                    currentPage === index + 1 ? "bg-red-400" : ""
                  }`}
                >
                  {index + 1}
                </button>
              ))}

              {/* Next Button */}
              <button
                onClick={() => handlePaginationClick(currentPage + 1)}
                className={`px-4 py-2 text-sm text-white font-medium bg-red-300 rounded-md ${
                  currentPage === totalPages
                    ? "bg-red-400 cursor-not-allowed"
                    : ""
                }`}
                disabled={currentPage === totalPages}
              >
                Next <FiChevronRight className="inline-block ml-1" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Render pop-up if showPopup is true */}
      {showPopup && selectedPrasadam && (
        <div className="fixed lg:ml-64  overflow-y-auto inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-3xl p-8 bg-white rounded-lg shadow-lg mt-80">
            {editedPrasadam.frontImage && (
              <div>
                <img
                  className="w-32 h-32 object-cover mb-4"
                  src={editedPrasadam.frontImage}
                  alt={editedPrasadam.productname}
                />
                <button
                  onClick={handleDeleteImage}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-300 rounded-md mr-2"
                >
                  Delete Image
                </button>
              </div>
            )}

            {/* Input to upload a new image */}
            <div>
              <label className="block text-sm font-medium text-black">
                Upload New Image
              </label>
              <input
                type="file"
                onChange={handleReplaceImage}
                className="mt-1 focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="productname"
                    className="block text-sm font-medium text-black"
                  >
                    Product Name
                  </label>
                  <input
                    type="text"
                    id="productname"
                    name="productname"
                    value={editedPrasadam.productname}
                    onChange={(e) =>
                      setEditedPrasadam({
                        ...editedPrasadam,
                        productname: e.target.value,
                      })
                    }
                    className="mt-1 focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                <div>
  <label
    htmlFor="productcategories"
    className="block text-sm font-medium text-black"
  >
    Product Categories
  </label>
  <select
    id="productcategories"
    name="productcategories"
    value={editedPrasadam.productcategories}
    onChange={(e) =>
      setEditedPrasadam({
        ...editedPrasadam,
        productcategories: e.target.value,
      })
    }
    className="mt-1 focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
  >
    <option value="" disabled>Select a Trendy or Not</option>
    <option value="Normal">Normal</option>
    <option value="Trendy">Trendy</option>
    {/* Add more options as needed */}
  </select>
</div>

                
                <div>
  <label
    htmlFor="categories"
    className="block text-sm font-medium text-black"
  >
    Categories
  </label>
  <select
    id="categories"
    name="categories"
    value={editedPrasadam.categories}
    onChange={(e) =>
      setEditedPrasadam({
        ...editedPrasadam,
        categories: e.target.value,
      })
    }
    className="mt-1 focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
  >
    <option value="" disabled>Select a category</option>
    <option value="Vegetables">Vegetables</option>
    <option value="Fruits">Fruits</option>
    <option value="Spices">Spices</option>
    {/* Add more options as needed */}
  </select>
</div>

                {/* Add more fields here for editing */}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="tags"
                    className="block text-sm font-medium text-black"
                  >
                    Tags
                  </label>
                  <input
                    type="text"
                    id="tags"
                    name="tags"
                    value={editedPrasadam.tags}
                    onChange={(e) =>
                      setEditedPrasadam({
                        ...editedPrasadam,
                        tags: e.target.value,
                      })
                    }
                    className="mt-1 focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-black"
                  >
                    Price
                  </label>
                  <input
                    type="text"
                    id="price"
                    name="price"
                    value={editedPrasadam.price}
                    onChange={(e) =>
                      setEditedPrasadam({
                        ...editedPrasadam,
                        price: e.target.value,
                      })
                    }
                    className="mt-1 focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                {/* Add more fields here for editing */}
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-black"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={editedPrasadam.description}
                    onChange={(e) =>
                      setEditedPrasadam({
                        ...editedPrasadam,
                        description: e.target.value,
                      })
                    }
                    className="mt-1 h-32 focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                {/* Add more fields here for editing */}
              </div>

              <div className="mt-4">
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-red-300 rounded-md mr-2"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium text-white bg-gray-400 rounded-md"
                  onClick={handleClosePopup}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default Prasadam;
