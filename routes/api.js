const express=require('express')
const path=require('path')
const crypto=require('crypto')
const router=express.Router()
let db=require('../db/db')

router.post('/test',function(req,res){
    res.send(req.body)
})
router.post('/login',function(req,res){
    
    if(ishaveEmpty([req.body.nickname,req.body.password])){
        res.status(401)
        res.send('<script type="text/javascript">alert("누락된 정보가 있습니다.");history.back();</script>')
        return
    }
    
    let bodynickname=req.body.nickname
    let bodypassword=req.body.password
    let hashedpass=crypto.createHash('sha256').update(bodypassword).digest('hex')

    let getpassquery='select password from accounts where name=?'
    db.query(getpassquery,bodynickname,function(err,data){
        if(err){
            // 쿼리문에 오류가 있다면
            res.status(401)
            res.send('<script type="text/javascript">alert("중간과정에 오류가 있었습니다.");history.back();</script>')
            console.log(err);
            
        } else {
            // 데이터가 없다면 - 해당하는 닉네임이 없을떄
            if(!data[0]){
                res.status(401)
                res.send('<script type="text/javascript">alert("닉네임 또는 비밀번호가 틀렸습니다.");history.back();</script>')
            } else {
                // 데이터가 있다면 - 해당하는 닉네임이 있을때
                let datapassword=data[0].password

                // 비밀번호가 맞았을떄
                if(hashedpass==datapassword){
                    req.session.isLogin=true
                    req.session.nickname=bodynickname
                    res.status(200)
                    res.send('<script type="text/javascript">alert("로그인되었습니다.");location.href="/"</script>')
                } else {
                    // 비밀번호가 틀렸을떄
                    res.status(401)
                    res.send('<script type="text/javascript">alert("닉네임 또는 비밀번호가 틀렸습니다.");history.back();</script>')
                }
            }
        }
    })
})

router.post('/register',function(req,res){
    if(ishaveEmpty[req.body.nicknamem,req.body.password]){
        res.status(401)
        res.send('<script type="text/javascript">alert("누락된 정보가 있습니다.");history.back();</script>')
        return
    }
    
    let bodynickname=req.body.nickname
    let bodypassword=req.body.password
    let hashedpass=crypto.createHash('sha256').update(bodypassword).digest('hex')
    console.log(bodypassword+'\n'+hashedpass)

    let account={name:bodynickname,password:hashedpass}
    let createaccountquery='insert into accounts set ?'
    db.query(createaccountquery,account,function(err,data){
        if(err){
            // 쿼리문에 오류가 있다면
            console.log(err)
            res.status(401)
            res.send('<script type="text/javascript">alert("중간과정에 오류가 있었습니다.");history.back();</script>')
        } else {
            res.send('<script type="text/javascript">alert("계정이 성공적으로 생성되었습니다.");location.href="/"</script>')
        }
    })
})

// get이지만 보여주는 화면이없어 백엔드로 분류
router.get('/logout',function(req,res){
    if(req.session.isLogin==true) {
        // 만약 로그인됐다면 세션정보 삭제
        req.session.destroy(function(){
            res.send('<script type="text/javascript">alert("성공적으로 로그아웃되었습니다");location.href="/"</script>')
        })
    }
    else {
        // 만약 로그인되지 않았다면 로그인 페이지로 이동
        res.redirect('/login')
    }
})

// 값없는 변수가 포함되있는지 확인하는 함수
function ishaveEmpty(array){
    let flag=false
    array.forEach(function(element){
        if(!Boolean(element)) {
            flag=true
            return
        }
    })
    return flag
}

module.exports=router