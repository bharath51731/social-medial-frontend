import React,{useEffect,useState,useContext} from 'react';
import {useHistory,Link} from 'react-router-dom';
import {UserContext} from '../../App';
import Loading from './Loading';
import swal from 'sweetalert';
import {url} from '../Url';
import M from 'materialize-css';
const Home = () =>
{
  const history = useHistory();
  if(!localStorage.getItem("token") || !localStorage.getItem("user"))
  {
   history.push('/signin');
  }
  let [posts,setPosts] = useState([]);
  const [load,setLoad]= useState(true);
  const {state,dispatch} = useContext(UserContext);
  const fetchPosts = () =>
  {
    fetch(url+"allpost/",
    {
     headers:{
        "Authorization":'Bearer '+JSON.parse(localStorage.getItem("token"))
      },
     })
    .then(res=>res.json())
    .then(data => {
    if(data.posts.length == 0)
    swal('NO POSTS')
    setPosts(data.posts)
    setLoad(false);
    
  })
    .catch(err=>{setLoad(false)})}
    
  useEffect(()=>{
    if(localStorage.getItem("token") && localStorage.getItem("user"))
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
    .then(data =>{
         
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
    .then(data =>{
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
  //fetchPosts();
 

  }).catch(err=>{
    M.toast({html: 'Something Went Wrong',classes:"#43a047 green darken-1"})
  })
    })
  }

return(

    <div>
{load ? <Loading /> :
    
    <div> 
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
       
        <img  className="postedbyimage"  src={data.postedBy.pic} alt={"image"}/>
        <h5 className="postedbyname" >{data.postedBy.name}</h5></div></Link>
        
      {data.photo == "" ? <hr /> : null } 

      {data.photo != "" ?  <div className="card-image" style={{padding:0,marginTop:8}}>
          <img src={data.photo} />
        </div> : null}
        <div className="card-content">            
      {/* <h6>{data.title}</h6> */}
         <p style={{overflowWrap: 'break-word'}}>{data.body}</p>
          <br />
          <div style={{display:'flex',flexDirection:'row',margin:0,padding:0}}>
         {!data.likes.includes(state._id) ? 
                
                <Link> <i style={{color:'grey'}} className="material-icons"
               onClick={()=>likepost(data._id)}>thumb_up </i><p style={{float:'right',marginLeft:5}}>{data.likes.length}likes</p></Link>
               :
                
               <Link> <i style={{color:'DodgerBlue'}} className="material-icons"
               onClick={()=>unlikepost(data._id)}>thumb_up </i>
               <p style={{float:'right',marginLeft:5}}>{data.likes.length}likes</p></Link>}
              
               </div>
               <Link to={`/viewfull/${data._id}`}  class="waves-effect waves-light btn" style={{textTransform:'capitalize'}}>View Comments ({data.comments.length})</Link>
         
         <p style={{float:'right',fontFamily:"'Dancing Script', cursive"}}>{data.createdOn}</p>
      
        </div>
    </div>
        )
   
      })
    }
            
           
     </div> : null}
     </div>
 } </div>
  )
}

export default Home;

// style="background-color:#F2F3F4"