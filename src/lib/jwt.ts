'use server'

import { CookieData } from "@/lib/types"
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const key = new TextEncoder().encode(process.env.JWT_SECRET);
const expires : Date = new Date(Date.now() + (10  *24*60*60*1000));

export async function encrypt(payload : any){
    return await new SignJWT(payload)
    .setProtectedHeader({ alg : "HS256" })
    .setIssuedAt()
    .setExpirationTime(expires)
    .sign(key)
}

export async function decrypt(cookie : string){
    const { payload } = await jwtVerify(cookie, key, {
        algorithms : ['HS256']
    })

    return payload;
}

export async function login(data : CookieData){

    const session = await encrypt({...data, expires});

    cookies().set("session", session, { expires, httpOnly : true });
}

export async function logout(){
    cookies().set("session", "", { expires: new Date(0), httpOnly : true });
}

export async function getSession(){
    const session = cookies().get("session")?.value
    if(!session){
        return null
    }

    return await decrypt(session);
}

export async function updateSession(request : NextRequest){
    const session = request.cookies.get('session')?.value;
    if(!session){
        return;
    }

    const parsedCookie = await decrypt(session);
    parsedCookie.expires = new Date(expires);
    const res = NextResponse.next();
    res.cookies.set({
        name: 'session',
        value: await encrypt(parsedCookie),
        httpOnly: true,
        expires: expires
    })
    return res;
}