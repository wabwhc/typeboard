import passport from 'passport';
import {Strategy as LocalStrategy} from 'passport-local';
import {conn} from './mysqlconn';


let User = {
    userid :  '',
}

function test(){
    passport.use(new LocalStrategy({usernameField:'userid', passwordField: "password",session: true}, 
    (userid : string, password : string, done:Function) => {
        let sql : string = 'select * from users where userid = ?';
        conn.query(sql, [userid], (err, result : Array<any>, field) => {
            User.userid = userid;
            if(result.length === 0){
                return done(null, false, { message : '아이디가 다름' })
            }else{
                if(result[0].password === password){
                    return done(null, User);
                }else{
                    return done(null, false, { message : '비번이 다름' })
                }
            }
        })
    }))

    passport.serializeUser((user, done) => {
        console.log(132)
        done(null, user);
    })

    passport.deserializeUser((user : object | null | undefined, done) => {
       console.log(user)
        done(null, user);
    })

}

export default test