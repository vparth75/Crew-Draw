'use client'

import axios from "axios"
import { useRef, useState } from "react"
import { HTTP_BACKEND } from "../config"
import { Router } from "next/router"

export default function AuthPage({ isSignin }:
  { isSignin: boolean }
) {
  
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  async function signup() {
    const response = await axios.post(`${HTTP_BACKEND}/signup`, {
      username,
      email,
      password
    });
  }

  async function signin() {
    try {
      const response = await axios.post(`${HTTP_BACKEND}/signin`, {
        username,
        password
      });
      sessionStorage.setItem("token", response.data.token);
      sessionStorage.setItem("userId", response.data.userId);
      // push to create room
    } catch (error) {
      console.error('Signin failed:', error);
    }
  }

  return <div className="h-screen w-screen flex justify-center items-center">
    <div className="p-5 text-black bg-white rounded flex flex-col">
      <div className="text-2xl pb-2.5 font-extrabold">{ isSignin ? "Sign In" : "Sign up" }</div>
      
      {!isSignin && <input type="text" placeholder="Enter your email..." className="p-2.5" onChange={(e) => {
        setEmail(e.target.value);
      }}></input>}
      <input type="text" placeholder="Enter your username..." className="p-2.5" onChange={(e) => {
        setUsername(e.target.value);
      }}></input>
      <input type="password" placeholder="Enter your password..." className="p-2.5 pb-5" onChange={(e) => {
        setPassword(e.target.value);
      }}></input>

      <button className="p-2.5 bg-black text-white rounded cursor-pointer" onClick={() => {
        
        isSignin ? signin() : signup();
      
      }}>{ isSignin ? "Sign In" : "Sign up" } </button>

      
    </div>
  </div>   
}