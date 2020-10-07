import React,{useEffect,useState,useContext} from 'react';
import {useParams,Link,useHistory} from 'react-router-dom';
import {UserContext} from '../../App';
import Loading from './Loading';
import {url} from '../Url';
import swal from 'sweetalert';
import M from 'materialize-css';

const ViewFull = () =>
{
    const history = useHistory();
    const {id} = useParams()
    const [data,setData] = useState(null)
    const {state,dispatch} = useContext(UserContext);
    const [load,setLoad]= useState(true);
    

    if(!localStorage.getItem("token") || !localStorage.getItem("user"))
  {
   history.push('/signin');
  }

const fetchDetails = () =>
    {
      
    fetch(url+"viewpost/",
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
    
      setData(data.posts[0])
    })
    .catch(err=>{
      
      setLoad(false)})
    }
    useEffect(()=>{
       fetchDetails()
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
        
        fetchDetails()

        
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

       fetchDetails()

       
   })
    .catch(err=>console.log(err))
  }

  const makeComment = (text,postId) =>
  {
    
    
    if(text.length>0)
    fetch(url+'comment',{
      method:"put",
      headers:{
          "Content-Type":"application/json",
          "Authorization":"Bearer "+JSON.parse(localStorage.getItem("token"))
      },
      body:JSON.stringify({
          postId,
          text
      })
  }).then(res=>res.json())
  .then(result=>{
     fetchDetails()
    
  }).catch(err=>{
      console.log(err)
  })
  
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
    {
    M.toast({html: 'Post Deleted',classes:"#43a047 green darken-1"})
    // fetchDetails()
    history.push('/');
    }
   
  
  }).catch(err=>{
      console.log(err)
  })
})
  }

  const deletecomment = (cid,pid) =>
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
     
    fetch(url+`deletecomment`,{
      method:"delete",
      headers:{
        "Content-Type":"application/json",
          "Authorization":"Bearer "+JSON.parse(localStorage.getItem("token"))
      },
      body:JSON.stringify({
        cid,
        pid
      })
  })
  .then(res=>res.json())
  .then(result=>{
    fetchDetails()
    // M.toast({html: 'Comment Deleted',classes:"#43a047 green darken-1"})
}).catch(err=>{
 
    console.log(err)
})
    }
    })
    .catch(err=>{
     
      console.log(err)})
}
    return(
      <>
    {load ? <Loading /> :
        <div> 
        {
         data ?
        <div className="Home">
  
              {
                
                  
                  <div  className="card home-card" style={{minWidth:'600px'}} >
                     {state._id === data.postedBy._id ? 
                 <Link> <i className="material-icons" style={{
                                  float:"right",
                                  margin:5,
                                  color:'grey'
                              }} 
                              onClick={()=>deletepost(data._id)}
                              >clear</i></Link>
                              : null}
                  <div style={{ display: 'flex'}}>
                  <img  className="postedbyimage" src={data.postedBy.pic} />
                  <Link to={data.postedBy._id !== state._id?"/profile/"+data.postedBy._id :"/profile"  }><h5 className="postedbyname">{data.postedBy.name}</h5></Link></div>
                  
                  {data.photo == "" ? <hr /> : null } 

  
                  <div className="card-image" style={{padding:0,marginTop:8}}>
                    <img src={data.photo} />
                  </div>
                  <div className="card-content">
                           
                   {/* <h6>{data.title}</h6> */}
                   <p style={{overflowWrap: 'break-word'}}>{data.body}</p>
  
                   <br />
          <div style={{display:'flex',flexDirection:'row'}}>
         {!data.likes.includes(state._id) ? 
                
                <Link> <i style={{color:'grey'}} className="material-icons"
               onClick={()=>likepost(data._id)}>thumb_up </i><p style={{float:'right',marginLeft:5}}>{data.likes.length}likes</p></Link>
               :
                
               <Link> <i style={{color:'DodgerBlue'}} className="material-icons"
               onClick={()=>unlikepost(data._id)}>thumb_up </i>
               <p style={{float:'right',marginLeft:5}}>{data.likes.length}likes</p></Link>}
              
               </div>
                    
                   <form onSubmit={(e)=>{e.preventDefault()
                   makeComment(e.target[0].value,data._id)
                   e.target[0].value=""
                   }}>
                  <input type="text" placeholder="Add a comment" maxlength="1000" required /> 
                  <button type="submit" class="btn" type="submit" name="action">
                    Comment
                      <i class="material-icons right">send</i>
                 </button>
                  </form>
                  
                  </div>
              </div>
                  
             
                
              }
             
            <h4 style={{marginLeft:20}}>Comments({data.comments.length})</h4>
              {/* <hr style={{margin:10}} /> */}
              
            <div >
             {data.comments.map((cont,i)=>{
                 return(
                  <div key={i} className="card home-card" 
                  style={{minWidth:'600px',maxWidth:'600px'}}   
                  >
                    {state._id == data.comments[data.comments.length-i-1].postedBy._id ? <i className="material-icons" style={{
                                        float:"right",
                                        margin:5,
                                        color:'grey'
                                    }} 
                                    onClick={()=>deletecomment(data.comments[data.comments.length-i-1]._id,data._id)}
                                    >clear</i> : null}
<Link to={data.comments[data.comments.length-i-1].postedBy._id !== state._id?"/profile/"+data.comments[data.comments.length-i-1].postedBy._id :"/profile"  }>
<div style={{ display: 'flex'}}>

        <img  style={{width:'30px',height:'30px',borderRadius:'30px',backgroundColor:'black',marginTop:10,marginLeft:5}} src={data.comments[data.comments.length-i-1].postedBy.pic} />
        <h5 style={{marginLeft:6,fontSize:15,marginBottom:6}}>{data.comments[data.comments.length-i-1].postedBy.name}</h5></div></Link>
                    
                   
                     <div style={{marginLeft:40,overflowWrap: 'break-word'}} > 
                     {data.comments[data.comments.length-i-1].text}
                     </div>
                     
                    
                    </div>
                 )
                 
                
                 
             })}
             </div>
            
           
                            
                        
                              
              
             
         </div> : null}
       </div>
}</>
    )
}

export default ViewFull;

// style={{minWidth:'600px',maxWidth:'600px',marginLeft:40,borderRadius:10,justifyContent:'center'}}
// style={{float:'left',marginLeft:30}}

