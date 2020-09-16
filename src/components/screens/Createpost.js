import React ,{useState,useEffect}from 'react';
import {useHistory} from 'react-router-dom';
import 'materialize-css';
import M from 'materialize-css';
import { CircularProgress } from "@material-ui/core";
import {url as u} from '../Url';
import {ckey} from '../Keys';


const CreatePost = () =>
{
    const history = useHistory();
    const [title,setTitle] = useState("");
    const [body,setBody] = useState("");
    const [image,setImage] = useState("");
    const [url,setUrl] = useState("");
    let [loading,setLoading] = useState(false);

  if(!localStorage.getItem("token") || !localStorage.getItem("user"))
  {
   history.push('/signin');
  }

    const postDetails = ()=>{
      if(!title && !image && !body)
      return  M.toast({html: "please fill atleast one feild",classes:"#43a047 red darken-1"})
        const data = new FormData()
        data.append("file",image)
        data.append("upload_preset","social-app")
        data.append("cloud_name",ckey)
        setLoading(true);
        if(image)
        fetch(`https://api.cloudinary.com/v1_1/${ckey}/image/upload`,{
            method:"post",
            body:data
        })
        .then(res=>res.json())
        .then(data=>{
           
            if(data.url)

             fetch(u+"createpost/",{
                 method:"post",
                 headers:{
                   "Content-Type":"application/json",
                   "Authorization":JSON.parse(localStorage.getItem("token"))
                 },
                 body: JSON.stringify({
                  title,
                  body,
                  url:data.url
                 })
               })
               .then(res => res.json())
               .then((data) => {
                setLoading(false);
                   if(data.error)
                   {
                     M.toast({html: data.error,classes:"#43a047 red darken-1"})
                   }
                   else
                   {
                     M.toast({html: 'Post created',classes:"#43a047 green darken-1"})
                     history.push('/')
                   }
                 
                 })
                 .catch(err => setLoading(false))
            else
            {
              setLoading(false);
            M.toast({html: "something went wrong",classes:"#43a047 red darken-1"})
            }
             
     
           
        })
        .catch(err=>{
          setLoading(false);
          M.toast({html: 'Something Went Wrong',classes:"#43a047 red darken-1"})
        })
        else

        fetch(u+"createpost/",{
            method:"post",
            headers:{
              "Content-Type":"application/json",
              "Authorization":JSON.parse(localStorage.getItem("token"))
            },
            body: JSON.stringify({
             title,
             body,
             url:""
            })
          })
          .then(res => res.json())
          .then((data) => {
            setLoading(false);
              if(data.error)
              {
                M.toast({html: data.error,classes:"#c62828 red darken-3"})
              }
              else
              {
                M.toast({html: 'Post created Succesfully',classes:"#43a047 green darken-1"})
                history.push('/')
              }
            
            })
            .catch(err => { 
              setLoading(false)
              M.toast({html: 'Something Went Wrong',classes:"#43a047 red darken-1"})
            })

    }
    
const style = {
    resize:'none',
    padding:'9px',
    height:'150px',
    fontSize:'15px',
    width:'678px',
};

  return(
      <div style={{marginTop:90}}>
        <div className="card input-filed"
        style={{
            margin:"30px auto",
            padding:"20px",
            textAlign:"center",
            width:'720px'}}>
            <input 
            type="text"
            placeholder="Title"
            maxlength="50"
            value={title}
            onChange={(e)=>setTitle(e.target.value)}
             /><br/><br/>

            <textarea style={style} onChange={(e)=>setBody(e.target.value)} placeholder="Body" maxlength="1000">
                {body}
            </textarea>
              
            <div className="file-field input-field">
             <div className="btn #64b5f6 blue darken-1">
                 <span>Uplaod Image</span>
                 <input type="file"
                 accept="image/*"   
                 onChange={(e)=>setImage(e.target.files[0])}/>
             </div>

             <div className="file-path-wrapper">
                 <input className="file-path validate" type="text" />
             </div>
             </div>
             <button disabled={loading} className="btn waves-effect waves-light #64b5f6 blue darken-1" onClick={()=>postDetails()}>
             {loading ? <span><CircularProgress style={{color:'#64b5f6'}}  size={20} />Loading...</span> : <>Create Post</>}
             </button>
             </div>
        </div>
        
    )
}

export default CreatePost;