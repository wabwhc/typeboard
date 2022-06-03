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
  article_at : string,
  search : boolean
}


function Body() {
  let [articles, setarticle] = useState([]);
  let [search, setsearch] = useState("");
  //let [load, setload] = useState(false);
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
          for(let i = 0; i < e.length; i++){
            e[i].search = true;
          }
          setarticle(e);
          //setload(true)
        }
        //setarticle(e);
        //if(e.length === 0){
        //  window.location.href = '/'
        //}
      })
    })
  }, [sub])
  useEffect(() => {
    for(let i = 0; i < articles.length; i++){
      articles[i].search = articles[i].article_title.includes(search);
    }
    setarticle([...articles]);
  }, [search])

  return (
    <div style={{'height' : '89%', 'position' : 'relative', 'top' : '1%'}}>
      <div id="search">
        <input style={{'width' : '100%', 'height' : '100%'}} type='text' placeholder="검색" onChange={(e) => setsearch(e.target.value.trim())}></input>
      </div>
    <div className="Body">
      {
        articles.length !== 0&&
          articles.map((art : article, index) => 
          art.search&&<Link to={'/article/' + art.article_id} key={index}><h1>{index + 1}.  {art.article_title}    {art.userid}</h1></Link>
        )
      }
    </div>
    </div>
  );
}

export default Body;