import passport from 'passport';
import {Strategy as LocalStrategy} from 'passport-local';
import {conn} from './mysqlconn';

interface User {
    userid : string;
}

function pass(){
    passport.use(new LocalStrategy({usernameField:'userid', passwordField: "password", session: true}, 
    (userid : string, password : string, done:Function) => {
        let sql : string = 'select * from users where userid = ?';
        conn.query(sql, [userid], (err, result : Array<any>, field) => {
            const user : User = {userid : userid}
            if(result.length === 0){
                return done(null, false, { message : '아이디가 다름' })
            }else{
                if(result[0].password === password){
                    return done(null, user);
                }else{
                    return done(null, false, { message : '비번이 다름' })
                }
            }
        })
    }))

    passport.serializeUser((user, done) => {
        done(null, user);
    })

    passport.deserializeUser((user : User, done) => {
        done(null, user);
    })

}

export default pass