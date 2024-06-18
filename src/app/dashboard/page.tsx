"use client";

import { logout } from "@/lib/jwt";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

const dashboard = () => {
  const [ getName, setName ] = useState("");
  const router = useRouter();
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/user/data", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
    
        const data = await response.json();
        if(!data){
          throw Error("Data not recived properly");
        }
    
        const userData = data.userData;
        console.log(userData);
        setName(userData.username)
      }
      fetchData()
  }, []);

  const logOut = async() => {
    await logout();
    router.push('/login')
  }

  return (
    <div className="dashboardPage">
      <Navbar name={getName} logOut={logOut}/>
    </div>
  );
};

export default dashboard;
