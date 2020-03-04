const express=require('express')
const path=require('path')
const router=express.Router()

router.get('/',function(req,res){

    if(req.session.isLogin==true) {
        // 만약 로그인됐다면 프로필 페이지로 이동
        res.redirect('/profile')
    }
    else {
        // 만약 로그인되지 않았다면 로그인 페이지로 이동
        res.redirect('/login')
    }
})

router.get('/profile',function(req,res){
    if(req.session.isLogin==true) {
        // 만약 로그인됐다면 프로필 페이지 보여주기
        res.render('../views/myprofile',{nickname:req.session.nickname})
    }
    else {
        // 만약 로그인되지 않았다면 로그인 페이지로 이동
        res.redirect('/login')
    }
})

router.get('/login',function(req,res){
    if(req.session.isLogin==true) {
        // 만약 로그인됐다면 프로필 페이지로 이동
        res.redirect('/profile')
    }
    else {
        res.sendFile(path.resolve('./views/loginpage.html'))
    }
})

router.get('/register',function(req,res){
    if(req.session.isLogin==true) {
        // 만약 로그인됐다면 프로필 페이지로 이동
        res.redirect('/profile')
    }
    else {
        res.sendFile(path.resolve('./views/register.html'))
    }
})

module.exports=router