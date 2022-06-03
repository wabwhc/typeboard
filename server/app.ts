import express, {Request, Response, NextFunction} from 'express';
import { conn } from './mysqlconn';
import fs from 'fs'
import cors from 'cors';
import path from 'path'
//------로그인 
import passport from 'passport'
import pass from './passport'
import session  from 'express-session';

const app : express.Application = express();

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: false}));
app.use(session({
    secret: '비밀코드', resave: true, saveUninitialized: false
})); // 세션 활성화

app.use(passport.initialize()); // passport 구동
app.use(passport.session()); // 세션 연결
declare global {
    namespace Express {
      interface User {
        userid : string;
      }
    }
}
//type RequestWithUser = Request & {user : any};
//function assertHasUser(req: Request): asserts req is RequestWithUser {
//    if (!( "user" in req)) {
//    }
//}
app.use(
    cors({
        origin: "http://localhost:3000", // allow to server to accept request from different origin
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true, // allow session cookie from browser to pass through
   })
);
pass();
app.use((req : Request, res : Response, next :NextFunction) => {
    if(!req.user){
        req.user = {userid : 'Anonymous'}
    }
    next();
})
app.delete('/:id', (req : Request, res : Response) => {
    let sql : string = 'delete from articles where article_id = ?';
    conn.query(sql, [req.params.id], () => {
        res.send('suc')
    })
})
app.get('/isLogin', (req : Request, res : Response) => {
    res.send(req.user)
})
app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.send('suc')
    })
})


app.get('/profileimg/:user', (req, res) => {
    let user = req.params.user;
    let sql = 'select userprofile from users where userid = ?'
    conn.query(sql, [user], (err, result : Array<any>, field) => {
        let id = result[0].userprofile
        res.sendFile(path.join(__dirname, '../public/'+ id + '.jpg'))
    })
})
app.post('/login', passport.authenticate('local', {
    successRedirect: 'http://localhost:3000/all',
    failureRedirect: 'http://localhost:3000/login',
}))

app.post('/signup', (req: Request, res : Response) => {

    let sql1 : string = 'select * from users where userid = ?';
    conn.query(sql1, [req.body.userid], (err, result : Array<any>, field) => {
        console.log(result);
        if(result.length !== 0){
            res.send("<script>alert('이미 회원가입된 아이디입니다.');  window.location.href = '\  http://localhost:3000/login \'</script>");
        }else{
            let sql2 : string = 'insert into users (userid, password) values (?, ?)';
            conn.query(sql2, [req.body.userid, req.body.password], (err, result, field) => {

            })
            res.redirect('http://localhost:3000/login');
        }
    })
})
app.post('/imgupdate', (req: Request, res : Response) => {
    //assertHasUser(req)
    let body = req.body.file;
    let base64Image = body.split(';base64,').pop();
    let sql = 'update  users set userprofile = ? where userid = ?'
    conn.query(sql, [req.user?.userid, req.user?.userid], (err, result : Array<any>, field) => {

        fs.writeFile('./public/'+ req.user?.userid +'.jpg', base64Image, 'base64', function(err) {
            console.log(err);
            res.send('ok')
        });
    })
})
//글 세부정보
app.get('/article/:id', (req: Request, res : Response) => {
    let id = req.params.id;
    let sql : string = 'select u.userid userid, article_content, article_at from users u, articles a where u.userid = a.userid and article_id = ?'
    conn.query(sql, [id],(err, result : Array<any>, field) => {
        res.send(result)
    })
})
//댓글 가져오기
app.get('/replys/:articleid', (req: Request, res : Response) => {
    let sql : string = 'select * from replys where article_id = ?'

    conn.query(sql, [req.params.articleid], (err, result, field) => {
        res.send(result)
    })
})
app.post('/writereply/:articleid', (req: Request, res : Response) => {
    let sql : string = 'insert into replys (userid, reply_content, article_id) values(?, ?, ?)'
    conn.query(sql, [req.user?.userid, req.body.content, req.params.articleid], (err, result, field) => {
        res.send('hello')
    })
})
//유저가 쓴 글.... 쓴 댓글
app.get('/userarticle/:userid', (req: Request, res : Response) => {
    let userid = req.params.userid;
    let sql : string = 'select article_title, article_id from articles where userid = ?';
    conn.query(sql, [userid],(err, result, field) => {
        res.send(result)
    })
})
app.get('/userreply/:userid', (req: Request, res : Response) => {
    let userid = req.params.userid;
    let sql : string = 'select reply_content, article_id from replys where userid = ?';
    conn.query(sql, [userid],(err, result, field) => {
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
                sql = 'select article_title, article_id, article_at, userid, article_at from articles order by article_at desc';
                conn.query(sql, (err, result2, field) => {
                    res.send(result2)
                })
            }else {
                sql = 'select article_title, article_id, article_at, userid, article_at from articles where subject = ? order by article_at desc'
                conn.query(sql, [subject], (err, result2 : Array<any>, field) => {
                    res.send(result2)
                })
            }
        }else{
            res.send(['fail'])
        }
    })
})
//글 작성
app.post('/write/:subject', (req : Request, res) => {
    let sql : string = 'insert into articles (userid, article_title, article_content, subject) values (?, ?, ?, ?)';
    req.body.content = req.body.content.replace(/\n/gi, "<br>")
    conn.query(sql,[req.user?.userid, req.body.title, req.body.content, req.params.subject], (err, result, field) => {
        res.redirect('http://localhost:3000/' + req.params.subject)
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