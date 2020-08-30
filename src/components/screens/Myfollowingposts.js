import React,{useEffect,useState,useContext} from 'react';
import {useHistory,Link} from 'react-router-dom';
import {UserContext} from '../../App';
import Loading from './Loading';
import {url} from '../Url';

const Myfollowings = () =>
{
const history = useHistory();
if(!localStorage.getItem("token") || !localStorage.getItem("user"))
  {
   history.push('/signin');
  }
  let [posts,setPosts] = useState([]);
  const {state,dispatch} = useContext(UserContext);
  const [load,setLoad]= useState(true);
  
  const fetchPosts = () =>
  {
    fetch(url+"followingpost",
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

return(
  <>
  {load ? <Loading /> :
    <div> 
      {
        posts ?
      <div className="Home">

            {
    
      posts.map((data,i)=>{
        return(
        <div key={i} className="card home-card" style={{borderRadius:'20px',width:'600px'}}>
          
        <div style={{ display: 'flex'}}>
        <img  style={{width:'50px',height:'50px',borderRadius:'50px',backgroundColor:'black',marginTop:6,marginLeft:5}} src={data.postedBy.pic} />
        <Link to={data.postedBy._id !== state._id?"/profile/"+data.postedBy._id :"/profile"  }><h5 style={{fontFamily:"'Dancing Script', cursive",marginLeft:6}} >{data.postedBy.name}</h5></Link></div>
        
       <hr />

        <div className="card-image" style={{padding:0,margin:0}}>
          <img src={data.photo} />
        </div>
        <div className="card-content">            
      <h6>{data.title}</h6>
         <p>{data.body}</p>

         {!data.likes.includes(state._id) ? 
                
                <Link> <i style={{color:'grey'}} className="material-icons"
               onClick={()=>likepost(data._id)}>thumb_up </i><p>{data.likes.length}likes</p></Link>
               :
                
               <Link> <i style={{color:'DodgerBlue'}} className="material-icons"
               onClick={()=>unlikepost(data._id)}>thumb_up </i><p>{data.likes.length}likes</p></Link>}<br/>
              <p style={{float:'right',marginTop:20,fontFamily:"'Dancing Script', cursive"}}>{data.createdOn}</p>
            <Link to={`/viewfull/${data._id}`} class="waves-effect waves-light btn">View Comments({data.comments.length})</Link>
      
        </div>
    </div>
        )
   
      })
    }
            
           
     </div> : null}
     </div>
} </>
  )
}

export default Myfollowings;