import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { firebase } from '../Firebase/config'; // Path to your firebaseConfig file
import { toast,ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { email, password } = formData;

    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
      toast.success('Login successful!');
      router.push('/'); // Redirect to home page after successful login
    } catch (error) {
      console.error('Login error:', error.message);
      toast.error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
  <section class="flex items-center justify-center min-h-screen mt-20 font-poppins">
        <div class="flex-1">
            <div class="px-2 mx-auto max-w-7xl lg:px-4">
                <div class="relative ">
                    <div class="relative px-4 py-4 bg-white shadow-md dark:bg-white md:py-11 sm:px-8">
                        <div class="max-w-lg mx-auto text-center">
                        <a href="/" class="inline-block mb-4 text-teal-900 dark:text-gray-400 lg:mb-7 ">
                                
                                <img src='logo.jpg' className='h-24 w-24 rounded-xl ' />
                            </a>
                            <h2 class="mb-4 text-2xl font-bold text-gray-700 lg:mb-7 md:text-5xl dark:text-gray-300">
                                Login your account</h2>
                            <p class="text-gray-500 dark:text-gray-400">Your credentials here</p>
                            <form onSubmit={handleLogin} class="mt-4 lg:mt-7 ">
                                <div class="">
                                    <input   type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
                                        class="w-full px-4 py-3 mt-2 bg-white rounded-lg lg:py-5 dark:text-gray-300 dark:bg-gray-700 -gray-800"
                                        />
                                </div>
                                <div class="mt-4 lg:mt-7">
                                    <div>
                                        <div class="relative flex items-center">
                                            <input  type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter password"
                                                class="w-full px-4 py-3 bg-white rounded-lg lg:py-5 dark:text-gray-300 dark:bg-gray-700 -gray-800 "
                                               />
                                            {/* <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                class="absolute right-0 mr-3 dark:text-gray-300 bi bi-eye-slash" fill="currentColor"
                                                 viewBox="0 0 16 16">
                                                <path
                                                    d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z" />
                                                <path
                                                    d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z" />
                                                <path
                                                    d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z" />
                                            </svg> */}
                                        </div>
                                    </div>
                                </div>
                                <div class="flex flex-wrap items-center justify-between mt-4 lg:mt-7">
                                   
                                    <a href="/Forgotpassword"
                                        class="mt-2 text-sm font-semibold text-teal-500 lg:mt-0 dark:text-teal-300 hover:underline">
                                        forgot password? </a>
                                </div>
                                <button
                                    class="w-full py-3 text-lg font-bold text-gray-300 uppercase bg-teal-700 rounded-md lg:mt-7 mt-7 dark:text-gray-300 dark:bg-teal-700 px-11 md:mt-7 hover:bg-teal-900 dark:hover:bg-teal-900"
                                    type="submit" disabled={loading}>{loading ? 'Loading...' : 'LOGIN'}</button>
                                <p class="mt-4 text-xs text-gray-700 lg:mt-7 dark:text-gray-400 lg:text-base">
                                    Need an account?
                                    <a href="/register" class="font-semibold text-teal-400 hover:text-teal-600">
                                        Create an account</a>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    </div>
  )
}

export default Login