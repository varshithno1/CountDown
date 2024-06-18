import { NextRequest, NextResponse } from "next/server";
import { getSession, updateSession } from "@/lib/jwt";

export async function middleware(request : NextRequest, response : NextResponse){
    let session = await getSession();
    if(request.nextUrl.pathname === "/dashboard"){
        if(!session){
            return NextResponse.redirect(new URL("/login", request.nextUrl));
        }
    }
    else if(request.nextUrl.pathname === "/login"){
        if(session){
            return NextResponse.redirect(new URL("/dashboard", request.nextUrl));
        }
    }
    else if(request.nextUrl.pathname === "/"){
        if(session){
            return NextResponse.redirect(new URL("/dashboard", request.nextUrl));
        }
        else{
            return NextResponse.redirect(new URL("/login", request.nextUrl));
        }
    }

    return await updateSession(request);

}