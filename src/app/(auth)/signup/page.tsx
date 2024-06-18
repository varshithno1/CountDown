"use client"

import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import { TSignUpSchema, signUpSchema, SignUpServerResponse, CookieData } from "@/lib/types"
import { useRouter } from 'next/navigation'
import { login } from "@/lib/jwt"
import Link from 'next/link'

const signup = () => {
  const {
    register,
    handleSubmit,
    formState : { errors, isSubmitting },
    reset,
    setError
  } = useForm<TSignUpSchema>({
    resolver : zodResolver(signUpSchema)
  });

  const router = useRouter();

  const onSubmit = async (data : TSignUpSchema) => {
    const response = await fetch("/api/user/su", {
      method : "POST",
      body : JSON.stringify({
        username : data.username,
        email : data.email,
        password : data.password,
        cpassword : data.cpassword
      }),
      headers : {
        "Content-Type" : "application/json"
      }
    })

    const responseData : SignUpServerResponse = await response.json();
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
      else if(errors.email){
        setError("email", {
          type : "server",
          message : errors.email
        })
      }
      else if(errors.password){
        setError("password", {
          type : "server",
          message : errors.password
        })
      }
      else if(errors.cpassword){
        setError("cpassword", {
          type : "server",
          message : errors.cpassword
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
            <h1 className='authH1'>SignUp</h1>



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
                <label htmlFor="email">Email:</label>
                <span className="errorAndInput">
                  <input
                    {
                      ...register("email")
                    }
                    type="email"
                    id='email'
                    disabled = {isSubmitting}
                  />
                  {errors.email && (
                    <span className="error">{`${errors.email.message}`}</span>
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
              <span className='labelInput'>
                <label htmlFor="cpassword">Confirm Password:</label>
                <span className="errorAndInput">
                  <input
                    {
                      ...register("cpassword")
                    }
                    type="password"
                    id='cpassword'
                    disabled = {isSubmitting}
                  />
                  {errors.cpassword && (
                    <span className="error">{`${errors.cpassword.message}`}</span>
                  )}
                </span>
              </span>
              <button
                disabled = {isSubmitting}
                id='submitButton'
              >SignUp</button>
            </form>

                  

          </div>
        </div>
        <div className='goTo'>
          <div className="seperator"></div>
          <span className='logInLink'>
            <span className='linkText'>
              Already have an account 
            </span>
            <Link href="/login" className='logInLinkText'>Log In</Link>
          </span>
        </div>
      </div>
    </div>
  )
}

export default signup