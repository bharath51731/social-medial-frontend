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
    //   setPosts(data.posts)
    })
    .catch(err=>setLoad(false))
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
         console.log(data)
        // const newData = data.map(item=>{
        //   if(item._id==data._id)
        //   return data
        //   else
        //   return item
        // })
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
    //    const newData = data.map(item=>{
    //      if(item._id==data._id)
    //      return data
    //      else
    //      return item
    //    })
       fetchDetails()

       
   })
    .catch(err=>console.log(err))
  }

  const makeComment = (text,postId) =>
  {
    
    console.log(text,postId)
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
      console.log(result)
    //   const newData = data.map(item=>{
    //     if(item._id==result._id){
    //         return result
    //     }else{
    //         return item
    //     }
    //  })
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
    //setPosts(result.message)
    if(!result.error)
    M.toast({html: 'Post Deleted',classes:"#43a047 green darken-1"})
    fetchDetails()
   
  
  }).catch(err=>{
      console.log(err)
  })
})
  }

  const deletecomment = (comment,pid) =>
  {
      
    
    fetch(url+`deletecomment`,{
      method:"delete",
      headers:{
        "Content-Type":"application/json",
          "Authorization":"Bearer "+JSON.parse(localStorage.getItem("token"))
      },
      body:JSON.stringify({
        comment,
        pid
      })
  })
  .then(res=>res.json())
  .then(result=>{
    fetchDetails()
}).catch(err=>{
    console.log(err)
})
}
    return(
      <>
    {load ? <Loading /> :
        <div> 
        {
         data ?
        <div className="Home">
  
              {
                
                  
                  <div  className="card home-card" style={{borderRadius:'20px',width:'600px'}}>
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
                  <img  style={{width:'50px',height:'50px',borderRadius:'50px',backgroundColor:'black',marginTop:6}} src={data.postedBy.pic} />
                  <Link to={data.postedBy._id !== state._id?"/profile/"+data.postedBy._id :"/profile"  }><h5 style={{fontFamily:"'Dancing Script', cursive",marginLeft:6}}>{data.postedBy.name}</h5></Link></div>
                  
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
                    
                   <form onSubmit={(e)=>{e.preventDefault()
                   makeComment(e.target[0].value,data._id)
                   e.target[0].value=""
                   }}>
                  <input type="text" placeholder="add a comment" /> 
                  <button type="submit" class="btn waves-effect waves-light" type="submit" name="action">
                    Comment
                      <i class="material-icons right">send</i>
                 </button>
                  </form>
                  
                  </div>
              </div>
                  
             
                
              }
             
              <h4 style={{fontFamily:"'Dancing Script', cursive" }}>Comments</h4>
              <hr style={{margin:10}} />
              
            
             {data.comments.map((cont,i)=>{
                 return(
                    <div >
                    <div key={i} style={{display:'flex',flexDirection:'row',marginLeft:80}}>
                    <img style={{width:'50px',height:'50px',borderRadius:'50px'}} src={data.comments[data.comments.length-i-1].postedBy.pic} />
                     <h6 style={{justifyContent:'center',marginBottom:10,}}><span style={{fontFamily:"'Dancing Script', cursive",fontSize:25,margin:4}}> 
        
                    <Link to={data.comments[data.comments.length-i-1].postedBy._id !== state._id?"/profile/"+data.comments[data.comments.length-i-1].postedBy._id :"/profile"  }> {data.comments[data.comments.length-i-1].postedBy.name} </Link>
                     {state._id == data.comments[data.comments.length-i-1].postedBy._id ? <i className="material-icons" style={{
                                        float:"right",
                                        margin:5,
                                        color:'grey'
                                    }} 
                                    onClick={()=>deletecomment(data.comments[data.comments.length-i-1],data._id)}
                                    >clear</i> : null}
                     </span><br/><> {data.comments[data.comments.length-i-1].text}
                     
                     </></h6>
                     </div>
                     <hr style={{width:800,float:'left',marginLeft:20}} /><br/>
                    </div>
                 )
                 
                
                 
             })}
            
           
                            
                        
                              
              
             
         </div> : null}
       </div>
}</>
    )
}

export default ViewFull;



// {data.comments.map((cont,i)=>{
//   return(
//      <div>
//      <div style={{display:'flex',flexDirection:'row',marginLeft:80}}>
//      <img style={{width:'50px',height:'50px',borderRadius:'50px'}} src={cont.postedBy.pic} />
//       <h6 style={{justifyContent:'center',marginBottom:10,}}><span style={{fontFamily:"'Dancing Script', cursive",fontSize:25,margin:4}}> 

//       {cont.postedBy.name}
//       {state._id == cont.postedBy._id ? <i className="material-icons" style={{
//                          float:"right",
//                          margin:5,
//                          color:'grey'
//                      }} 
//                      onClick={()=>deletecomment(cont,data._id)}
//                      >clear</i> : null}
//       </span><br/><> {cont.text}
      
//       </></h6>
//       </div>
//       <hr style={{width:800,float:'left',marginLeft:20}} /><br/>
//      </div>
//   )
// })}