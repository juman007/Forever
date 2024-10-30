import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import axios from "axios";

const Login = () => {
   const { token, setToken, navigate, backendURL } = useContext(ShopContext);

   const [currentSate, setCurrentState] = useState("Login");
   const [name, setName] = useState("");
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");

   const onSubmitHandler = async (event) => {
      event.preventDefault();
      try {
         if (currentSate === "Sign Up") {
            const response = await axios.post(
               backendURL + "/api/user/register",
               { name, email, password }
            );

            if (response.data.success) {
               setToken(response.data.token);
               localStorage.setItem("token", response.data.token);
            } else {
               toast.error(response.data.message);
            }
         } else {
            const response = await axios.post(backendURL + "/api/user/login", {
               email,
               password,
            });
            if (response.data.success) {
               setToken(response.data.token);
               localStorage.setItem("token", response.data.token);
            } else {
               toast.error(response.data.message);
            }
         }
      } catch (error) {
         console.log(error);
         toast.error(error.message);
      }
   };

   useEffect(() => {
      if (token) {
         navigate("/");
      }
   }, [token]);

   useEffect(() => {
      if (!token && !localStorage.getItem("token")) {
         setToken(localStorage.getItem("token"));
      }
   }, []);

   return (
      <form
         onSubmit={onSubmitHandler}
         className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
      >
         <div className="inline-flex items-center gap-2 mb-2 mt-10">
            <p className="prata-regular text-3xl">{currentSate}</p>
            <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
         </div>
         {currentSate === "Login" ? (
            ""
         ) : (
            <input
               onChange={(e) => setName(e.target.value)}
               value={name}
               className="w-full px-3 py-2 border border-gray-800"
               type="text"
               placeholder="Name..."
               required
            />
         )}{" "}
         <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className="w-full px-3 py-2 border border-gray-800"
            type="email"
            placeholder="Email..."
            required
         />
         <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className="w-full px-3 py-2 border border-gray-800"
            type="password"
            placeholder="Password..."
            required
         />
         <div className="w-full flex justify-between text-sm mt-[-8px]">
            <p className="cursor-pointer">Forgot your password?</p>
            {currentSate === "Login" ? (
               <p
                  onClick={() => setCurrentState("Sign Up")}
                  className="cursor-pointer"
               >
                  Create account
               </p>
            ) : (
               <p
                  onClick={() => setCurrentState("Login")}
                  className="cursor-pointer"
               >
                  Login here
               </p>
            )}
         </div>
         <button className="bg-black text-white font-light px-8 py-2 mt-4">
            {currentSate === "Login" ? "Sign In" : "Sign Up"}
         </button>
      </form>
   );
};

export default Login;
