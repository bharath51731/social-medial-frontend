import React,{useEffect,useState,useContext}from 'react';
import {useHistory} from 'react-router-dom';
import {UserContext} from '../../App';
import {useParams,Link} from 'react-router-dom';
import Loading from './Loading';
import {url} from '../Url';
import { CircularProgress } from "@material-ui/core";
const UserProfile = () =>
{
  const history = useHistory();
  const {state,dispatch} = useContext(UserContext)
  const [data,setData] = useState(null);
  const [isFollowing,setFollow] = useState(false);
  const [profile,setProfile] = useState(null);
  const [isfetch,setFetch] = useState(false);
  const [load,setLoad]= useState(true);
  const [fload,setFload] = useState(false)
  const [uload,setUload] = useState(false)
  
  const {id} = useParams()

  if(!localStorage.getItem("token") || !localStorage.getItem("user"))
  {
   history.push('/signin');
  }
const fetchPosts = () =>
  {
  fetch(url+`user/${id}`,
    {
     headers:{
        "Authorization":'Bearer '+JSON.parse(localStorage.getItem("token"))
      },
     }
    )
    .then(res=>res.json())
    .then(data => {
    
      setLoad(false);
    if(data.user == null)
    {
    setFetch(true)
    return setData(null);
    }

     setFetch(true)
      setData(data)
      
    }
    )
    .catch(err=>setLoad(false))
  }

  useEffect(()=>{
    fetchPosts();
  },[])


  const followuser = () =>
  {
    setFload(true);
    fetch(url+'follow',{
      method:"put",
      headers:{
          "Content-Type":"application/json",
          "Authorization":"Bearer "+JSON.parse(localStorage.getItem('token'))
      },
      body:JSON.stringify({
          followid:id
      })
  }).then(res=>res.json())
  .then(data=>{ 
    
    fetchPosts();
    setFload(false);
  })
  .catch(err=>setFload(false))
  }
  const unfollowuser = () =>
  {
    setUload(true);
    fetch(url+'unfollow',{
      method:"put",
      headers:{
          "Content-Type":"application/json",
          "Authorization":"Bearer "+JSON.parse(localStorage.getItem('token'))
      },
      body:JSON.stringify({
          followid:id
      })
  }).then(res=>res.json())
  .then(data=>{ 
    
    fetchPosts();
    setUload(false);
  })
  .catch(err=>setUload(false))
  }

  
  return(
    <>
    {load ? <Loading /> :
    <>
    {isfetch&&data ?  
     <div style={{maxWidth:"550px",margin:"10px auto"}}>
       <div style={{
         display:'flex',
        justifyContent:'space-around',
         marginLeft:'18px',
         borderBottom:'1px solid black'
       }}>
         <div>
       <img style={{width:'160px',height:'160px',borderRadius:'80px',backgroundColor:'black'}} 
        src={data.user.pic}
       />
       </div>
        <div >
        <h4 style={{fontFamily:"'Dancing Script', 'cursive'"}}>{data.user.name}</h4>
      <h6>{data.user.email}</h6>
     
      {!data.user.followers.includes(state._id) ?
      <button disabled={fload} style={{
                       margin:"10px"
                   }} className="btn waves-effect waves-light #64b5f6 blue darken-1"
                    onClick={()=>followuser()}>
                      {fload ? <span><CircularProgress style={{color:'#64b5f6'}}  size={20} />Loading</span> : <> Follow</>}
                    
                    </button>
                    :
                     <button disabled={uload} style={{
                       margin:"10px"
                   }} className="btn waves-effect waves-light #64b5f6 blue darken-1"
                    onClick={()=>unfollowuser()}>
                      {uload ? <span><CircularProgress style={{color:'#64b5f6'}}  size={20} />Loading</span> : <> UNFOLLOW</>}
                      </button>}
                    
        
        <div style={{display:"flex",justifyContent:"space-between",width:"108%"}}>
           <h6>{data.user.followers.length} followers</h6>
           <h6>{data.user.following.length} following</h6>
          {!data.user.followers.includes(state._id)?<h6>{data.posts.length} posts</h6>:<Link to={`/myposts/${data.user._id}`}><h6>{data.posts.length} posts</h6></Link>} 
          {/* <Link to={`/myposts/${data.user._id}`}><h6>{data.posts.length} posts</h6></Link> */}
        </div>
       </div>
      </div>

      
     
     </div>
     : null}
     </>
}</>
  )
}
export default UserProfile;

