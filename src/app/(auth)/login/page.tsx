"use client"

import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import { TLogInSchema, logInSchema, LogInServerResponse, CookieData } from "@/lib/types"
import { useRouter } from 'next/navigation'
import { login } from "@/lib/jwt"
import Link from 'next/link'

const logInPage = () => {
  const {
    register,
    handleSubmit,
    formState : { errors, isSubmitting },
    reset,
    setError
  } = useForm<TLogInSchema>({
    resolver : zodResolver(logInSchema)
  });

  const router = useRouter();

  const onSubmit = async (data : TLogInSchema) => {
    const response = await fetch("/api/user/li", {
      method : "POST",
      body : JSON.stringify({
        username : data.username,
        password : data.password,
      }),
      headers : {
        "Content-Type" : "application/json"
      }
    })

    const responseData : LogInServerResponse = await response.json();
    if(!response.ok){
      return;
    }

    if(responseData.errors){
      const errors = responseData.errors;
      if(errors.username){
        setError("username", {
          type : "server",
          message : errors.username
        })
      }
      else if(errors.password){
        setError("password", {
          type : "server",
          message : errors.password
        })
      }
      return;
    }

    if(responseData.userData){
      const { username } = responseData.userData.user;
      const cookieData : CookieData = {
        username : username
      }
      login(cookieData);
    }

    reset();
    router.push("/dashboard");
  }

  return (
    <div className='signup'>
      <div className="logoText">
        <span className="logoName">Count<span className='logoNameTwo'>Down</span></span>
        <img className='logo' src="./Logo(no bg).png" alt="" />
      </div>
      <div className="noAcc">
        <div className="white">
          <div className="form">
            <h1 className='authH1'>LogIn</h1>



            <form className='mainForm' onSubmit={handleSubmit(onSubmit)}>
              <span className='labelInput'>
                <label htmlFor="username">Username:</label>
                <span className="errorAndInput">
                  <input
                    {
                      ...register("username")
                    }
                    type="text"
                    id='username'
                    disabled = {isSubmitting}
                  />
                  {errors.username && (
                    <span className="error">{`${errors.username.message}`}</span>
                  )}
                </span>
              </span>
              <span className='labelInput'>
                <label htmlFor="password">Password:</label>
                <span className="errorAndInput">
                  <input
                    {
                      ...register("password")
                    }
                    type="password"
                    id='password'
                    disabled = {isSubmitting}
                  />
                  {errors.password && (
                    <span className="error">{`${errors.password.message}`}</span>
                  )}
                </span>
              </span>
              <button
                disabled = {isSubmitting}
                id='submitButton'
              >LogIn</button>
            </form>

                  

          </div>
        </div>
        <div className='goTo'>
          <div className="seperator"></div>
          <span className='signUpLink'>
            <span className='linkText'>
              Don't have an account 
            </span>
            <Link href="/signup" className='signUpLinkText'>Sign Up</Link>
          </span>
        </div>
      </div>
    </div>
  )
}

export default logInPage