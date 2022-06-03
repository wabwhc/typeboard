import { useParams, Link } from "react-router-dom"

function Btn(){
    let parmas = useParams();

    return(
        <div style={{width:'70%', backgroundColor:'red', margin : 'auto'}}>
            {
                Object.keys(parmas)[1] === 'subject'? 
                <Link to={'/write/' + parmas.subject}><button>글작성</button></Link >
                : Object.keys(parmas)[1] === 'id'?
                <>
                    <button onClick={() => {fetch('http://localhost:8080/' + parmas.id, {method : 'delete'}).then(() => window.location.href = '/all')}}>삭제</button>
                </>
                :null
            }
        </div>
    )
}

export default Btn