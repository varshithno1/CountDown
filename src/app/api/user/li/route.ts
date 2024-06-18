import { logInSchema, TLogInSchema } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { db } from "@/lib/db";

const secret = Number(process.env.MAIN_SECRET);

export async function POST(req : NextRequest){
    const data : TLogInSchema = await req.json();
    const validateData = logInSchema.safeParse(data);

    let zodErrors = {};
    if(!validateData.success){
        validateData.error.issues.forEach((issue) => {
            zodErrors = {...zodErrors, [issue.path[0]]: issue.message};
        })
        return NextResponse.json({ errors : zodErrors , userData : null});
    }

    const { username, password } = validateData.data;    

    const dbUser = await db.user.findFirst({
        where : { username : username }
    })
    if(!dbUser){
        return NextResponse.json(
            {
                errors : {
                    username : "Username Not found"
                },
                userData : null
            }
        )
    }

    const pass : string = String(dbUser?.password);
    
    if(!bcrypt.compareSync(password, pass)){
        return NextResponse.json(
            {
                errors : {
                    password : "Wrong Password"
                },
                userData : null
            }
        )
    }

    return NextResponse.json(
        {
            errors : null,
            userData : {
                msg : "Sucessfully Logged In",
                user : dbUser
            }
        }
    )
}