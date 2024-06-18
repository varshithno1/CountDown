import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { db } from "@/lib/db";
import { TSignUpSchema, signUpSchema, SignUpUserDataResponse } from "@/lib/types"

const secret = Number(process.env.MAIN_SECRET);

export async function POST(req : NextRequest){
    const data : TSignUpSchema = await req.json();
    const validateData = signUpSchema.safeParse(data);
    
    let zodErrors = {};
    if(!validateData.success){
        validateData.error.issues.forEach((issue) => {
            zodErrors = {...zodErrors, [issue.path[0]]: issue.message};
        })
        return NextResponse.json({ errors : zodErrors , userData : null});
    }

    const { username, email, password } = validateData.data;
    const hash = bcrypt.hashSync(password, secret);

    const isUsernameTaken = await db.user.findUnique({
        where : { username : username }
    })
    if(isUsernameTaken){
        return NextResponse.json(
            {
                errors : {
                    username : "Username Already Taken"
                },
                userData : null
            }
        )
    }
    
    const isEmailTaken = await db.user.findUnique({
        where : { email : email }
    });
    if(isEmailTaken){
        return NextResponse.json(
            {
                errors : {
                    email : "Email Already Taken"
                },
                userData : null
            }
        )
    }

    const newUser : SignUpUserDataResponse = await db.user.create({
        data : {
            username : username,
            email : email,
            password : hash
        }
    })

    return NextResponse.json(
        {
            errors : null,
            userData : {
                msg : "User Created",
                user: newUser
            }
        }
    );
}