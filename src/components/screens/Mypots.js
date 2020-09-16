import React,{useEffect,useState,useContext} from 'react';
import {useHistory,Link,useParams} from 'react-router-dom';
import {UserContext} from '../../App';
import swal from 'sweetalert';
import Loading from './Loading';
import {url} from '../Url';
import M from 'materialize-css';
import { CircularProgress } from "@material-ui/core";

const Myposts = () =>
{
  const history = useHistory();
  if(!localStorage.getItem("token") || !localStorage.getItem("user"))
  {
   history.push('/signin');
   
  }
  const {id} = useParams()
  
  let [posts,setPosts] = useState([]);
  const {state,dispatch} = useContext(UserContext);
  const [load,setLoad]= useState(true);
  const [delload,setDelload] = useState(false);
  const fetchPosts = () =>
  {
    fetch(url+"myallpost/",
    {
      method:"post",
      headers:{
        "Content-Type":"application/json",
        "Authorization":'Bearer '+JSON.parse(localStorage.getItem("token"))
      },
      body:JSON.stringify({
        id
      })
     })
    .then(res=>res.json())
    .then(data => {
      
      setLoad(false);
      setPosts(data.posts)
    })
    .catch(err=>setLoad(false))
  }

  useEffect(()=>{
   fetchPosts()
  },[])

  const likepost = (id) =>
  {
    fetch(url+'like',{
      method:"put",
      headers:{
        "Content-Type":"application/json",
        "Authorization":'Bearer '+JSON.parse(localStorage.getItem("token"))
      },
      body:JSON.stringify({
        postId:id
      })
    })
    .then(res=>res.json())
    .then(data =>
       {
         
        const newData = posts.map(item=>{
          if(item._id==data._id)
          return data
          else
          return item
        })

        setPosts(newData)
    })
    .catch(err=>console.log(err))
  }

  const unlikepost = (id) =>
  {
    fetch(url+'unlike',{
      method:"put",
      headers:{
        "Content-Type":"application/json",
        "Authorization":"Bearer "+JSON.parse(localStorage.getItem("token"))
      },
      body:JSON.stringify({
        postId:id
      })
    })
    .then(res=>res.json())
    .then(data =>
      {
       const newData = posts.map(item=>{
         if(item._id==data._id)
         return data
         else
         return item
       })

       setPosts(newData)
   })
    .catch(err=>console.log(err))
  }



  const deletepost = (postId) =>
  {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover ",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then((willDelete) => {
    if(willDelete)
    fetch(url+`deletepost/${postId}`,{
      method:"delete",
      headers:{
          "Authorization":"Bearer "+JSON.parse(localStorage.getItem("token"))
      },
  })
  .then(res=>res.json())
  .then(result=>{
  if(!result.error)
  M.toast({html: 'Post Deleted',classes:"#43a047 green darken-1"})
    const newData = posts.filter(item=>{
      return item._id !== result._id
  })
  
  setPosts(newData)
  }).catch(err=>{
      console.log(err)
  })
});
  }

  const deleteAllPost = () =>
  {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover ",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then((willDelete) => {
    if(willDelete)
    {
      setDelload(true);
    
    fetch(url+`deleteAllPost/`,{
      method:"delete",
      headers:{
          "Authorization":"Bearer "+JSON.parse(localStorage.getItem("token"))
      },
  })
  .then(res=>res.json())
  .then(result=>{
  if(!result.error)
  {
   M.toast({html: 'All Posts Deleted',classes:"#43a047 green darken-1"})
   history.push('/');
  }
  else
  {
    M.toast({html: 'Something Went Wrong',classes:"#43a047 red darken-1"})
  }
  setDelload(false);
 
  }).catch(err=>{
    M.toast({html: 'Something Went Wrong',classes:"#43a047 red darken-1"})
    setDelload(false);
      console.log(err)
  })
}
})
.catch(err=> console.log(err));
    
  }

return(
    <>
    {load ? <Loading /> :
    <div> 
       {/* <div style={{float:'right'}}>
       {state._id === id ?  <button className="btn waves-effect waves-light #64b5f6 red darken-1" style={{margin:4,color:'white'}} 
       disabled={delload}
       onClick={()=>deleteAllPost()}
       >
       {delload ? <span><CircularProgress style={{color:'#64b5f6'}}  size={20} />Loading...</span> : <>Delete All Posts</>}
       
       </button> : null}
        </div> */}
      {
        posts ?
       
      <div className="Home">

            {
              posts.map((data,i)=>{
                return(
                <div key={i} className="card home-card" style={{minWidth:'600px'}} >
                   {state._id === data.postedBy._id ? 
               <Link> <i className="material-icons" style={{
                                float:"right",
                                margin:5,
                                color:'grey'
                            }} 
                            onClick={()=>deletepost(data._id)}
                            >clear</i></Link>
                            : null}
                             <Link to={data.postedBy._id !== state._id?"/profile/"+data.postedBy._id :"/profile"  }>
                <div style={{ display: 'flex'}}>
               
                <img  style={{width:'50px',height:'50px',borderRadius:'50px',backgroundColor:'black',marginTop:6,marginLeft:5}} src={data.postedBy.pic} />
                <h5 style={{fontFamily:"'Dancing Script', cursive",marginLeft:6}}>{data.postedBy.name}</h5></div></Link>
                
              
               {data.photo == "" ? <hr /> : null } 

                <div className="card-image" style={{padding:0,marginTop:8}}>
                  <img src={data.photo} />
                </div>
                <div className="card-content">
               
               
              <h6>{data.title}</h6>
                 <p>{data.body}</p>
                 
                 <br />
          <div style={{display:'flex',flexDirection:'row'}}>
         {!data.likes.includes(state._id) ? 
                
                <Link> <i style={{color:'grey'}} className="material-icons"
               onClick={()=>likepost(data._id)}>thumb_up </i><p style={{float:'right'}}>{data.likes.length}likes</p></Link>
               :
                
               <Link> <i style={{color:'DodgerBlue'}} className="material-icons"
               onClick={()=>unlikepost(data._id)}>thumb_up </i>
               <p style={{float:'right'}}>{data.likes.length}likes</p></Link>}
              
               </div>
               
                  <Link to={`/viewfull/${data._id}`} class="waves-effect waves-light btn" style={{textTransform:'capitalize'}}>View Comments ({data.comments.length})</Link>
                  <p style={{float:'right',marginTop:20,fontFamily:"'Dancing Script', cursive"}}>{data.createdOn}</p>

                
                </div>
            </div>
                )
           
              })
            }
           </div> : null}
     </div> 
}</>
  )
}

export default Myposts;