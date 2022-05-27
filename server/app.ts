import express, {Request, Response, NextFunction} from 'express';
import { conn } from './mysqlconn';

import cors from 'cors';

//------로그인 
import passport from 'passport'
import pass from './passport'
import session  from 'express-session';

const app : express.Application = express();

app.use(express.urlencoded({extended: false}))
app.use(session({
    secret: '비밀코드', resave: true, saveUninitialized: false
})); // 세션 활성화

app.use(passport.initialize()); // passport 구동
app.use(passport.session()); // 세션 연결

app.use(
    cors({
         origin: "http://localhost:3000", // allow to server to accept request from different origin
         methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
         credentials: true, // allow session cookie from browser to pass through
   })
);
pass();

app.post('/isLogin', (req : Request, res : Response) => {
    if(!req.user){
        req.user = {userid : 'Anonymous'}
    }
    res.send(req.user)
})
app.get('/logout', (req, res) => {
    console.log(req.session)
    req.session.destroy(() => {
        res.send('suc')
    })
})

app.post('/login', passport.authenticate('local', {
    successRedirect: 'http://localhost:3000/all',
    failureRedirect: 'http://localhost:3000/all',
}))

app.post('/signup', (req: Request, res : Response) => {

    let sql1 : string = 'select * from users where userid = ?';
    conn.query(sql1, [req.body.userid], (err, result : Array<any>, field) => {
        console.log(result);
        if(result.length !== 0){
            res. send("<script>alert('이미 회원가입된 아이디입니다.');  window.location.href = '\  http://localhost:3000/login \'</script>");
        }else{
            let sql2 : string = 'insert into users (userid, password) values (?, ?)';
            conn.query(sql2, [req.body.userid, req.body.password], (err, result, field) => {

            })
            res.redirect('http://localhost:3000/login');
        }
    })
})


app.get('/article/:id', (req: Request, res : Response) => {
    let id = req.params.id;
    let sql : string = 'select * from articles where article_id = ?';
    conn.query(sql, [id],(err, result, field) => {
        res.send(result)
    })
})


app.get('/subjects', (req: Request, res : Response) => {
    let sql : string = 'select * from subjects';
    conn.query(sql, (err, result, field) => {
        res.send(result)
    })
})

app.get('/:subject', (req: Request, res : Response) => {

    let {subject} = req.params;

    let sql : string
    sql = 'select * from subjects where subject = ?'
    conn.query(sql, [subject], (err, result1 : Array<any>, field) => {
        if(result1.length !== 0){
            if(subject === 'all'){
                sql = 'select article_title, article_id, article_at, userid, article_at from articles';
                conn.query(sql, (err, result2, field) => {
                    res.send(result2)
                })
            }else {
                sql = 'select article_title, article_id, article_at, userid, article_at from articles where subject = ?'
                conn.query(sql, [subject], (err, result2 : Array<any>, field) => {
                    res.send(result2)
                })
            }
        }else{
            res.send(['fail'])
        }
    })
})


app.get('/', (req : Request, res : Response) => {
    conn.query('select * from users', (err:Error, result:Array<object>) => {
        res.send(result)
    })
})



app.listen(8080, () => {
    console.log('8080 conn')
})