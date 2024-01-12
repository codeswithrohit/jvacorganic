import React, { useState, useEffect } from "react";
import { firebase } from "../../Firebase/config";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminNavbar from "../../src/components/AdminNavbar";
const User = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [registration, setRegistration] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 5;
  const router = useRouter();

  useEffect(() => {
    const db = firebase.firestore();
    const RegistrationRef = db.collection("Users");

    RegistrationRef.get()
      .then((RegistrationSnapshot) => {
        const RegistrationData = [];
        RegistrationSnapshot.forEach((doc) => {
          // Include doc.id within the object
          RegistrationData.push({
            id: doc.id,
            ...doc.data(),
          });
        });

        // Sort the RegistrationData based on createdAt in descending order
        RegistrationData.sort(
          (a, b) => new Date(b.currentDate) - new Date(a.currentDate)
        );

        setRegistration(RegistrationData);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error getting documents: ", error);
        setIsLoading(false);
      });
  }, []);
  const deleteUser = (userId) => {
  const db = firebase.firestore();

  // Remove user from Firestore
  const deleteFirestoreUser = async () => {
    try {
      return await db.collection("Users")
        .doc(userId)
        .delete();
    } catch (error) {
      throw new Error(`Error deleting user from Firestore: ${error}`);
    }
  };

  // Remove user from Firebase Authentication
  const deleteAuthUser = async () => {
    const userToDelete = firebase.auth().currentUser;
    if (userToDelete) {
      try {
        return await userToDelete.delete();
      } catch (error) {
        throw new Error(`Error deleting user from Authentication: ${error}`);
      }
    } else {
      return Promise.resolve(); // Resolve immediately if no user is signed in
    }
  };

  // Sequentially delete user from Firestore and then from Authentication
  deleteFirestoreUser()
    .then(() => {
      console.log("User deleted from Firestore successfully!");

      return deleteAuthUser();
    })
    .then(() => {
      console.log("User deleted from Authentication successfully!");
      toast.success("User deleted successfully!");
    })
    .catch((error) => {
      console.error("Error deleting user:", error.message);
      toast.error("Error deleting user");
    });
};

  
  
  
  
  
  


  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRegistration = registration.slice(startIndex, endIndex);

  const totalPages = Math.ceil(registration.length / itemsPerPage);
  const sendEmail = (email) => {
    window.location.href = `mailto:${email}`;
  };
  return (
    <div className="min-h-screen bg-white dark:white">
      <AdminNavbar />
      <>
        <div className="w-full lg:ml-64  sm:px-6">
          <div className="px-4 md:px-10 py-4 md:py-7 bg-gray-100 rounded-tl-lg rounded-tr-lg">
            <div className="sm:flex items-center justify-between">
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold leading-normal text-black">
                Users Data
              </p>
            </div>
          </div>

          <div className="bg-white shadow px-4 md:px-10 pt-4 md:pt-7 pb-5 overflow-y-auto">
            <table className="w-full whitespace-nowrap">
              <thead>
                <tr className="h-16 w-full text-sm leading-none text-black">
                  <th className="font-normal text-left pl-4">Name </th>
                  <th className="font-normal text-left pl-12">Email</th>
                  <th className="font-normal text-left pl-12">Mobile Number</th>
                  <th className="font-normal text-left pl-20">Address</th>
                </tr>
              </thead>
              <tbody className="w-full">
                {currentRegistration.map((data, index) => (
                  <tr className="h-20 text-sm leading-none text-black bg-white hover:bg-gray-100 border-b border-t border-gray-100">
                    <td className="pl-4 cursor-pointer">
                      <div className="flex items-center">
                        <div className="pl-4">
                          <p className="font-medium">{data.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="pl-12">
                      <p className="text-sm font-medium leading-none text-black">
                        {data.email}
                      </p>
                    </td>
                    <td className="pl-12">
                      <p className="text-xs leading-3 text-black mt-2">
                        {data.mobileNumber}
                      </p>
                    </td>
                    <td className="pl-12">
                      <p className="text-xs leading-3 text-black mt-2">
                        {data.address}
                      </p>
                    </td>
                    <td className="pl-12">
        <button onClick={() => deleteUser(data.id)} className="text-red-500 hover:text-red-700">
          Delete
        </button>
      </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-center mt-4">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`mx-1 px-3 py-1 rounded ${
                  currentPage === i + 1
                    ? "bg-gray-800 text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </>
      <ToastContainer />
    </div>
  );
};

export default User;
