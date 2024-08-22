import passport from "passport";
import local from "passport-local"
import User from "../models/user.js"
import { createHash, isValidPassword } from "../utils.js";



const LocalStrategy = local.Strategy;

const initializePassport = ()=>{
    
    passport.use("register", new LocalStrategy(
    {passReqToCallback:true, usernameField:"email"},async(req,email, passsword, done)=>{
        const {first_name, last_name, age} = req.body;

        try {
            let user = await User.findOne({email})
            if(user){
                console.log("usuario existente")
                return done(null,false)
            }
            const newUser={
                first_name,
                last_name,
                email,
                age,
                passsword:createHash(passsword)
            }

            let result = await User.create(newUser)
            return done(null, result)

        } catch (error) {
            return done(`error al obtener el usuario" ${error}`)
        }


    }))


    passport.serializeUser((user, done)=>{
        done(null, user._id)
    });

    passport.deserializeUser(async(id, done)=>{
        let user = await User.findById(id)
        done(null,user)
    })
}


export default initializePassport;
