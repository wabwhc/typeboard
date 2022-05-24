import express, {Request, Response, NextFunction} from 'express';
import { conn } from './mysqlconn';

import cors from 'cors';

//------로그인 
import passport  from 'passport'
import pass from './passport'
import session  from 'express-session';
import path from 'path';

const app : express.Application = express();

app.use(express.urlencoded({extended: false}))
app.use(session({
    secret: '비밀코드', resave: true, saveUninitialized: false
})); // 세션 활성화

app.use(passport.initialize()); // passport 구동
app.use(passport.session()); // 세션 연결
app.use(cors());

pass();


//app.get('/test' ,(req, res) =>{
//    res.sendFile(path.join(__dirname, '../index.html'))
//})

//app.post('/login', passport.authenticate('local', {
//    successRedirect: '/',
//    failureRedirect: '/test',
//}))

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
    conn.query(sql, [subject], (err, result1, field) => {
        if(result1){
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