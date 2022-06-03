import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Reply from './Reply';
interface id {
    id ?: string
}
interface art {
    article_content : string;
    article_at : string;
    userid : string;
}

interface props {
    isLog : string;
    setuserid : Function;
}

function Article(props : props){
    let [article, setarticle] = useState<art>();
    let [load, setload] = useState(false);
    let {id} : id = useParams()

    useEffect(() => {
        fetch('http://localhost:8080/article/' + id).then(e => {
            e.json().then(e => {
                console.log(e)
                let date = new Date(e[0].article_at);
                console.log(date)
                e[0].article_at = date.getFullYear() + '.' + date.getMonth() + "." + date.getDate() + "  " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
                console.log(e)
                props.setuserid(e[0].userid)
                setarticle(e[0])
                fetch('http://localhost:8080/profileimg/' + e[0].userid)
                .then(e => e.blob().then(imageBlob => {
                    const url = URL.createObjectURL(imageBlob);
                    let profile =document.getElementById('articleProfile');
                    profile.style.backgroundImage = `url(${url})`;
                    setload(true);
                }))
            })
        })
    }, [])

    return(
        <div className="Article" style={{'overflow' : 'hidden'}}>
            <div id="contenttest" style={{'width' : '100%', 'boxShadow' : '0px 0px 0px 2px black inset'}}>
                <div  style={{'margin' : '3px','width' : '10%', 'aspectRatio': '1/1','borderRadius': '50%', 'display' : 'inline-block', 'backgroundSize' : 'cover'}}
                    onClick={() => {
                    window.location.href = `/profile/${article.userid}`
                }} id='articleProfile' />
                {
                load&&
                <div>
                <div style={{'display' : 'inline-block'}}>
                    <h3 style={{'display' : 'inline-block', 'marginLeft' : '3%'}}>{article.userid}</h3>
                    <h4>{article.article_at}</h4>
                </div>
                <hr style={{'borderColor' : 'black', 'marginTop' : '2px'}}></hr>
                <p dangerouslySetInnerHTML={{__html : article.article_content}} id='content'>
                </p>
                </div>
                }
            </div>
            
            <Reply isLog={props.isLog} />
        </div>
    )
}

export default Article