const express = require('express');
const session = require('express-session');
const app=express()

app.use(session({
    secret:'anysecretkey',
    resave:false,
    saveUninitialized:true,
}))

// post body 사용
app.use(express.json());
app.use(express.urlencoded({extended:false}))
// ejs 사용
app.set('view engine', 'ejs');
app.set('views', 'views');

// 프론트엔드 페이지 라우터
let indexRouter=require('./routes/index')
app.use('/',indexRouter)

// 백엔드 api 라우터
let apiRouter=require('./routes/api')
app.use('/api',apiRouter)

app.listen(3000)