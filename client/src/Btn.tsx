import { useParams } from "react-router-dom"

function Btn(){
    let parmas = useParams();
    return(
        <div style={{width:'70%', backgroundColor:'red', margin : 'auto'}}>
            {
                Object.keys(parmas)[1] === 'subject'? 
                <button>글작성</button>
                : Object.keys(parmas)[1] === 'id'?
                <>
                <button>삭제</button>
                <button>수정</button>
                </>
                :null
            }
        </div>
    )
}

export default Btn