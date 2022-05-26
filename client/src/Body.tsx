import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

interface sub {
  subject ?: string;
}

interface article {
  article_id : number,
  article_title : string,
  userid : string,
  subject : string,
  article_at : string
}


function Body() {

  let [articles, setarticle] = useState([]);
  

  let [sub, setsub] = useState<string>("");
  let {subject} : sub|undefined = useParams()
  if(subject === undefined){
    window.location.href = '/all'
  }else if(sub !== subject){
    setsub(subject)
  }

 

  useEffect(() => {
    fetch('http://localhost:8080/'+ sub).then(e => {
      e.json().then( e => {
        if(e[0] === 'fail'){
          window.location.href = '/all'
        }else{
          setarticle(e);
        }
        
        //setarticle(e);
        //if(e.length === 0){
        //  window.location.href = '/'
        //}
      })
    })
  }, [sub])

    
    return (
      <div className="Body">
        {
          articles.length === 0 ? null
          : articles.map((art : article, index) => 
          <Link to={{pathname: '/article/' + art.article_id}} key={index}><h1>{index + 1}.  {art.article_title}</h1></Link>
          )
        }
      </div>
    );
  }
  
  export default Body;