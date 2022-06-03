import { useParams } from "react-router-dom"

function Write(){
    let a = useParams();
    
    return(
        <div className="write" style={{'height' : '80%'}}>
            <form action= {"http://localhost:8080/write/" + a.subject} method="post" style={{'height' : '100%', 'position' : 'relative', 'top': '1%'}}>
                <button onClick={(e) => {
                    let title = document.getElementById('title') as HTMLInputElement;
                    let content = document.getElementById('content') as HTMLTextAreaElement;
                    if(title.value === ''){
                        e.preventDefault();
                        alert('제목을 입력하세요');
                    }else if(content.value === ''){
                        e.preventDefault();
                        alert('내용을 입력하세요');
                    }
                }}>작성</button>
                <input type='text' placeholder="제목작성하는 곳" name='title' style={{'margin' : 'auto', 'display' : 'block'}}  id='title' />
                <textarea name='content' placeholder="글작성하는 곳" style={{'width' : '80%', 'height' : '100%', 'display' : 'block','margin' :'auto'}} id='content' />
                
            </form>
        </div>
    )
}

export default Write