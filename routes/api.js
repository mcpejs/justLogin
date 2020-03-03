const express=require('express')
const path=require('path')
const router=express.Router()
let db=require('../db/db')

router.post('/login',function(req,res){
    
    if(ishaveEmpty([req.body.nickname,req.body.password])){
        res.status(401)
        res.send('<script type="text/javascript">alert("누락된 정보가 있습니다.");history.back();</script>')
        return
    }
    
    let bodynickname=req.body.nickname
    let bodypassword=req.body.password

    let getpassquery='select password from accounts where name=?'
    db.query(getpassquery,bodynickname,function(err,data){
        if(err){
            // 쿼리문에 오류가 있다면
            res.status(401)
            res.send('<script type="text/javascript">alert("중간과정에 오류가 있었습니다.");history.back();</script>')
        } else {
            // 데이터가 없다면 - 해당하는 닉네임이 없을떄
            if(!data[0]){
                res.status(401)
                res.send('<script type="text/javascript">alert("닉네임 또는 비밀번호가 틀렸습니다.");history.back();</script>')
            } else {
                // 데이터가 있다면 - 해당하는 닉네임이 있을때
                let datapassword=data[0].password

                // 비밀번호가 맞았을떄
                if(bodypassword==datapassword){
                    req.session.isLogin=true
                    req.session.nickname=bodynickname
                    res.status(200)
                    res.send('<script type="text/javascript">alert("로그인되었습니다.");location.href='/'</script>')
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

    let account={name:bodynickname,password:bodypassword}
    let createaccountquery='insert into accounts set ?'
    db.query(createaccountquery,account,function(err,data){
        if(err){
            // 쿼리문에 오류가 있다면
            console.log(err)
            res.status(401)
            res.send('<script type="text/javascript">alert("중간과정에 오류가 있었습니다.");history.back();</script>')
        } else {
            res.status(200)
            res.send('<script type="text/javascript">alert("계정이 성공적으로 생성되었습니다.");.location.href='/'</script>')
        }
    })
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