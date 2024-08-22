import { Router } from "express"

const router = Router()


router.get("/api/sessions/register",(req,res)=>{
    res.render("register")
})


router.get("/api/sessions/login",(req,res)=>{
    res.render("login")
})

router.get("/profile", (req,res)=>{
    if(!req.session.user){
        return res.redirect("/login")
    }

    const { first_name, last_name, email,age} = req.session.user
    res.render("profile", {first_name, last_name, email,age})
})

router.get("/api/sessions/restore",(req,res)=>{
    res.render("restore")
})

router.get("/failregister", async(req,res)=>{
    console.log("registro fallido")
    res.send({error:"failed"})
})



export default router