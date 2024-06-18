import { db } from "@/lib/db";
import { logout } from "@/lib/jwt";
import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

const key = new TextEncoder().encode(process.env.JWT_SECRET);

export async function POST(req : NextRequest){
    const session = req.cookies.get("session")?.value;
    if(!session){
        return NextResponse.json({
            msg : "Cookie Not Found",
            userData : null
        })
    }
    const { payload } = await jwtVerify(session, key, {
        algorithms: ['HS256']
    })
    if(!payload){
        return NextResponse.json({
            msg : "Decryption Error",
            userData : null
        })
    }
    
    const username = String(payload.username);
    const userDataDb = await db.user.findFirst({
        where : { username : username }
    })
    if(!userDataDb){
        await logout();
        return NextResponse.json({
            msg : "User not found",
            userData : null
        })
    }
    const { password, ...data } = userDataDb;
    
    return NextResponse.json({
        msg : 'User found',
        userData : data
    })
}