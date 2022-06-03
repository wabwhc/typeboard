import { useState } from "react"

function Login(){
    let [isLog, setisLog] = useState(false)

    fetch('http://localhost:8080/isLogin',{
        method:'get',
        credentials : 'include'
    }).then(e => {
        e.json().then(e => {
            if(e.userid !== 'Anonymous'){
                window.location.href = '/all'
            }else{
                setisLog(true);
            }
        })
    })

    const mainstyle = {
        'width' : '80%',
        'height' : '100%',
        'backgroundColor' : 'purple',
        'margin' : 'auto'
    }
    const logstyle = {
        'width' : '70%',
        'height' : '20%',
        'backgroundColor' : 'white',
        'margin' : 'auto',
        'text-align' : 'center',
        'border' : '2px solid black',
        'marginTop' : '10%'
    }

    const signstyle = {
        'width' : '70%',
        'height' : '20%',
        'backgroundColor' : 'white',
        'margin' : 'auto',
        'text-align' : 'center',
        'border' : '2px solid black',
        'marginTop' : '10%'
    }
    return(
        <>
        {
            !isLog ? null
            : 
            <div style={mainstyle}>
                <form style={logstyle} action="http://localhost:8080/login" method="post">
                    <input id="id" name="userid"  placeholder="아이디"></input><br></br><br></br>
                    <input id="pw"  name="password" type="password"   placeholder="비밀번호"></input><br></br><br></br>
                    <button>로그인</button>
                </form>



                <form style={signstyle} action="http://localhost:8080/signup" method="post">
                    <input id="id" name="userid"  placeholder="아이디"></input><br></br><br></br>
                    <input id="pw"  name="password" type="password"   placeholder="비밀번호"></input><br></br><br></br>
                    <button>회원가입</button>
                </form>
            </div>
        }
        </>
        
    )
}
export default Login;