import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface props {
    isLog : string;
}
function Reply(props : props){
    let a = useParams();
    let [replys, setreplys] = useState([]);
    //useEffect(() => {
    //    fetch('http://localhost:8080/profileimg/' + props.isLog)
    //    .then(e => e.blob().then(imageBlob => {
    //        // Then create a local URL for that image and print it 
    //        const url = URL.createObjectURL(imageBlob);
    //        let profile =document.getElementById('test');
    //        //img.src = url;
    //        profile.style.backgroundImage = `url(${url})`
    //    }))
    //}, [props.isLog])
    useEffect(() => {
        fetch('http://localhost:8080/replys/' + a.id)
        .then(e => e.json().then(e => {
            setreplys(e);
        }))
        
    }, [])
    const submit = () => {
        let reply = document.getElementById('text') as HTMLTextAreaElement;
        console.log(reply.value)
        let json = { content : reply.value}
        console.log(JSON.stringify(json))
        fetch('http://localhost:8080/writereply/' + a.id, {
            method : 'post',
            credentials : 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(json)
        }).then(() => window.location.reload())
    }
    return(
        <div style={{width: '100%', position:'relative',height:'100%'}} >
            <div style={{'borderBottom' : '2px solid red', 'borderTop' : '2px solid red', 'height' : '20%', 'backgroundColor' : '#E2E2E2'}}>
                <textarea style={{'position' : 'relative','top' : '10%','display' : 'block', 'margin' : 'auto','width' : '80%', 'height' : '70%'}} placeholder="댓글 입력창" id="text"/>
                <button onClick={submit}>작성</button> 
            </div>
            {
                replys.length === 0 ? null
                :
                replys.map((a, i) => {
                    return <h4 key={i}>{a.userid} {a.reply_content}</h4>
                })
            }  
        </div>
    )
}


export default Reply;