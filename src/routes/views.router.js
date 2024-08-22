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





export default router