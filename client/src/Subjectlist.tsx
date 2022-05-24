import { useEffect, useState } from "react";
import { Link } from "react-router-dom";


interface subject {
    subject : string
}

function Subjectlist(){
    let [subjects, setsubjects] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8080/subjects').then(e => {
            e.json().then(e => {
                setsubjects(e);
            })
        })
    }, [])
    
    return(
        <div className="Subjectlist">
            {
                subjects.length === 0 ? null
                : subjects.map((sub : subject, index) => 
                <Link to ={sub.subject} key={index}><h3>{sub.subject}</h3></Link>
                )
            }
        </div>
    )
}

export default Subjectlist;