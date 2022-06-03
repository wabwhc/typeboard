import { CSSProperties, ReactElement, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
//import './App.css';
import 'react-image-crop/dist/ReactCrop.css'
import Subjectlist from './Subjectlist';
import React from 'react';

function Profile(){
    let {user} = useParams();
    const [imageSrc, setImageSrc] = useState<any>('');
    let [mode, setmode] = useState('none');
    let [isLog, setisLog] = useState('Anonymous');
    let [article, setarticle] = useState([]);
    let [reply, setreply] = useState([]);

    useEffect(() => {fetch('http://localhost:8080/isLogin',{
        credentials : 'include'
      }).then(e => e.json().then(e => {
        console.log(e);
        setisLog(e.userid);
        fetch('http://localhost:8080/userarticle/' + user).then(e => {
            e.json().then(e => {setarticle(e)})
        });
        fetch('http://localhost:8080/userreply/' + user).then(e => {
            e.json().then(e => {setreply(e)})
        });
      }));}
    , [])
    useEffect(()=> {
        fetch('http://localhost:8080/profileimg/' + user,{
          credentials : 'include'
        }).then(e => e.blob().then(imageBlob => {
          // Then create a local URL for that image and print it 
          const url = URL.createObjectURL(imageBlob);
          let profile =document.getElementById('profile');
          //img.src = url;
          profile.style.backgroundImage = `url(${url})`;
    }))
    },[mode])


    const encodeFileToBase64 = (fileBlob) => {
        const reader = new FileReader();
        reader.readAsDataURL(fileBlob);
        reader.onload = () => {
            setImageSrc(reader.result);
        }
    };
    interface Crop {
        unit : 'px' | '%';
        x : number;
        y : number;
        width : number;
        height : number;
    }

    let onCropComplete = (crop : any, percentcrop : any) => {
        let canvas = document.getElementById("canvas") as HTMLCanvasElement;
        // canvas 영역을 잘려진 이미지 크기 만큼 조절합니다.
        let divimg = document.getElementById("img");
        let ctx = canvas.getContext('2d');
        let img = new Image();
        img.src = imageSrc;

        
        let ratio = img.width / divimg.clientWidth;

        canvas.width = crop.width * ratio;
        canvas.height = crop.height * ratio;

        ctx.drawImage(
            // 원본 이미지 영역입니다.
            img, // 원본 이미지
            crop.x * ratio, // 잘려진 이미지 x 좌표
            crop.y * ratio, // 잘려진 이미지 y 좌표
            crop.width * ratio, // 잘려진 이미지 가로 길이
            crop.height * ratio, // 잘려진 이미지 세로 길이
            // canvas 영역
            0, // 이미지 시작 x 좌표
            0, // 이미지 시작 y 좌표
            crop.width * ratio, // 이미지 가로 길이
            crop.height * ratio // 이미지 세로 길이
          );
          document.body.appendChild(canvas);
    }
    let [crop, setcrop] = useState<Crop>({
        unit : '%',
        x : 0,
        y : 0,
        width : 0,
        height : 0,
    })
    const cancel = () => {
        setmode('none');
        let a = document.getElementById('input') as HTMLInputElement;
        a.value = '';
        setImageSrc(undefined);
    }
    const complete = () => {
        let canvas = document.getElementById("canvas") as HTMLCanvasElement;
        const imgBase64 = canvas.toDataURL('image/jpeg', 'image/octet-stream');


        fetch('http://localhost:8080/imgupdate', {
            method : 'post',
            credentials : 'include',
            headers: { "content-type": "application/json"}, 
            body: JSON.stringify({ file: imgBase64 })
        }).then(e => {
            cancel();
        })

    }
    return(
        <div style={{'width' : '100%', 'height' : '100%'}}>
        <div className="middle" style={{'backgroundColor' : 'blue', 'marginLeft' : '15%', 'display' : 'inline-block'}}>
            <div style={{'height' : '25%'}} />
            <div style={{'float' : 'left','color' : 'white', 'width' : '70%','height' : '50%', 'display' : 'inline-block', 'backgroundColor' : 'pink'}}>
                <div style={{'textAlign' : 'center'}}>{user}</div>
                <div style={{'backgroundColor' : 'black', 'width' : '100%', 'height' : '40%'}}>
                    <div style={{'height' : '10%','textAlign' : 'center'}}>작성 글</div>
                    <div style={{'height' : '90%', 'overflow' : 'scroll'}}>
                        {
                            article.length === 0 ? <h5>작성한 글이 없습니다.</h5>
                            : article.map((e, i) => <h5 key={i} onClick = {() => window.location.href='/article/'+ e.article_id}>{e.article_title}</h5>)
                        }
                    </div>
                </div>
                <div style={{'backgroundColor' : 'red', 'width' : '100%', 'height' : '40%'}}>
                    <div style={{'height' : '10%','textAlign' : 'center'}}>작성 댓글</div>
                    <div style={{'height' : '90%', 'overflow' : 'scroll'}}>
                        {
                            reply.length === 0 ? <h5>작성한 댓글이 없습니다.</h5>
                            : reply.map((e, i) => <h5 key={i} onClick = {() => window.location.href='/article/'+ e.article_id}>{e.reply_content}</h5>)
                        }
                    </div>
                </div>
            </div>
            <div style={{'width' : '30%', 'paddingBottom' : '30%', 'borderRadius': '50%', 'display' : 'inline-block', 'backgroundSize' : 'cover'}} id='profile'/>
            <button onClick={() => {
                if(isLog !== user){
                    alert('본인 프로필이 아닙니다.');
                }else{
                    setmode('block');
                }
            }} style = {{'display' : 'block', 'margin' : 'auto', 'width' : '10%'}}>수정</button>
        </div>
        <div style={{'display' : 'inline-block'}}>
            <Subjectlist />
        </div>
        <div style={{'display' : `${mode}`, 'position' : 'absolute', 'width' : '60%', 'height' : '60%', 'top' : '10%', 'left' : '15%'}}  id='form'>
            <input id='input' type='file' onChange={(e) => {
                encodeFileToBase64(e.target.files[0]);
            }} />
            <button onClick={cancel}>취소</button>
            <button onClick={complete}>확인</button>
            <div>
                {
                    imageSrc && 
                    <ReactCrop onComplete={onCropComplete} circularCrop={true} crop={crop} aspect={1} onChange={(crop, percentCrop) => setcrop(crop)}>
                        <img src={imageSrc} id='img' />
                    </ReactCrop>
                }
                
            </div>
        </div>
        <canvas id='canvas' style={{'display' : 'none'}}></canvas>
        </div>
    )
}

export default Profile