import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Reply from './Reply';
interface id {
    id ?: string
}
interface art {
    article_content : string
}



function Article(){
    let [article, setarticle] = useState<art[]>([]);
    let [load, set] = useState(false);
    let {id} : id = useParams()

    useEffect(() => {
        fetch('http://localhost:8080/article/' + id).then(e => {
            e.json().then(e => {
                console.log(e)
                setarticle(e)
                set(true);
            })
        })
    }, [])

    return(
        <div className="Body">
            {
                load?
                <div>
                    {article[0].article_content}
                </div>
                :null
            }
            <Reply />
        </div>
    )
}

export default Article