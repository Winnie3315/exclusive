"use server"

import User from "@/models/user.model"
import {mongooseConnect} from "@/lib/mongodb"

export async function createUser(user: any) {
    
    try{
        await mongooseConnect()
        const newUser = await User.create(user);
        // await newUser.save()
        return JSON.parse(JSON.stringify(newUser))
    } catch (error) {
        console.log(error);
    }

}