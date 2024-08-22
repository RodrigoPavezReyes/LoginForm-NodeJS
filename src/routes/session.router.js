import { Router } from "express"
import User from "../models/user.js"
import { createHash,isValidPassword } from "../utils.js"

const router = Router()


router.post("/api/sessions/register", async(req,res)=>{
    try {
        const { first_name, last_name, email,age,password} = req.body
        if(!first_name || !last_name || !email || !age || !password){
            return res.status(400).send({status:"error", error:"Faltan datos"})
        }
        const user = new User({ 
            first_name, 
            last_name, 
            email,
            age, 
            password: createHash(password)
            })
        await user.save()

        console.log(user)

        res.send({status:"ok", message:"usuario creado con exito", payload:user})
        res.redirect("/api/sessions/login")

    } catch (error) {
        console.error("Error al registrarse:", error);
        res.status(500).send("Error al registrarse");
    }
})


router.post("/api/sessions/login",async(req,res)=>{
    try {
        const {email,password} = req.body
        if(!email || !password){
            return res.send({status:"error", error:"Faltan datos para iniciar sesion"})
        }
        
            //busco en DB por correo electronico

        const user = await User.findOne({email})

        console.log(user)

        
        //si el user no existe o el password es incorrecto
        if (!user) {
            return res.status(401).send({ status: "error", error: "Usuario no encontrado" });
        }
        if(!isValidPassword(user,password)){
            return res.status(403).send({status:"error", error:"Contraseña incorrecta"})
        }
        delete user.password  //eliminar el password, es dato sensible!
        req.session.user = user

        res.send({status:"ok", message:"Usuario logueado", payload:user})
        res.redirect("/profile");



    } catch (error) {
        console.error("Error en el inicio de sesión:", error);
        res.status(500).send({ status: "error", error: "Error interno del servidor" });
    }
})



export default router