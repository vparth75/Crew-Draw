'use client'

import { useState } from "react"

export default function AuthPage({ isSignin }:
  { isSignin: boolean }
) {
  
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  

  return <div className="h-screen w-screen flex justify-center items-center">
    <div className="p-5 text-black bg-white rounded flex flex-col">
      <div className="text-2xl pb-2.5 font-extrabold">{ isSignin ? "Sign In" : "Sign up" }</div>
      
      {!isSignin && <input type="text" placeholder="Enter your name..." className="p-2.5"></input>}
      <input type="text" placeholder="Enter your email..." className="p-2.5"></input>
      <input type="password" placeholder="Enter your password..." className="p-2.5 pb-5"></input>

      <button className="p-2.5 bg-black text-white rounded cursor-pointer" onClick={() => {
        
        

      }}>{ isSignin ? "Sign In" : "Sign up" } </button>

      
    </div>
  </div>   
}