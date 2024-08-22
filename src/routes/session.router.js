import { Router } from "express"
import User from "../models/user.js"
import { createHash,isValidPassword } from "../utils.js"
import passport from "passport"

const router = Router()


router.post("/api/sessions/register", passport.authenticate("register", {failureRedirect:"/failregister"}), async(req,res)=>{
    res.send ({status:"success", message:"Usuario registrado"})
})

router.get("/failregister", async(req,res)=>{
    console.log("failed Strategy");
    res.status(400).send({ error: "Usuario ya registrado" });
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


//Restore password

router.post("/api/sessions/restore",async(req,res) =>{
    const {email, password} = req.body

    if(!email || !password){
        return res.status(400).send({status:"error", error: "Correo y contraseña requeridos"})
    }

    try {
        //Actualizo contraseña en base a los datos usando mail
        const updateUser = await User.findOneAndUpdate(
            {email : email},
            {password: createHash(password)},
            {new:true}
        );

        if(!updateUser){
            return res.status(404).send({status:"ERROR", error:"Usuario no encontrado"})
        }

        //Actualizar la informacion de usuario en la sesion
        req.session.user = updateUser;
        res.redirect("/api/sessions/login")

    } catch (error) {
        return res.status(500).send({status:"error", error:"error al actualizar password"})
        
    }
})




export default router