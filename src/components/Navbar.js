import React ,{useContext,useRef,useEffect,useState}from 'react';
import {Link,useHistory} from 'react-router-dom';
import {UserContext} from '../App';
import Load from './screens/Loading';
import M from 'materialize-css';
import {url} from './Url';
import { CircularProgress } from "@material-ui/core";
import {url as u} from './Url';
import {ckey} from './Keys';


const colour = "white";
const navcolor= "#34495E";
// "#34495E";#34495E

const sidenavcolor= "white";
const sidecolour = "black";
// const colour = "white";
// const navcolor= "#1e90ff";

const Navbar = () =>
{
  const history = useHistory(); 
  const {state,dispatch} = useContext(UserContext)
  const  searchModal = useRef(null)
  const  side = useRef(null)
  const  post = useRef(null)
  const [search,setSearch] = useState('')
  const [userDetails,setUserDetails] = useState([])
  const [title,setTitle] = useState("");
  let [body,setBody] = useState("");
  let [image,setImage] = useState("");
  let [loading,setLoading] = useState(false);
  
  
  useEffect(()=>{
    M.Modal.init(searchModal.current);
    M.Sidenav.init(side.current);
    M.Modal.init(post.current);
},[])
const fetchUsers = (query) =>
{
  setSearch(query)
  if(query)
  fetch(url+'search-users',{
    method:"post",
    headers:{
      "Content-Type":"application/json"
    },
    body:JSON.stringify({
      query
    })
  }).then(res=>res.json())
  .then(results=>{
    setUserDetails(results.user)
  })
}

const postDetails = ()=>{
  let posttext = body;
  let postimage = image;

  posttext = posttext.trim();

 
  

  if( !image && !posttext)
  return  M.toast({html: "please fill atleast one field",classes:"#43a047 red darken-1"})
    const data = new FormData()
    data.append("file",postimage)
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
           
              body:posttext,
              url:data.url
             })
           })
           .then(res => res.json())
           .then((data) => {
            setLoading(false);
               if(data.error)
               {
                 M.toast({html: data.error,classes:"#43a047 red darken-1"})
                 clear();
               }
               else
               {
                 M.toast({html: 'Post created Succesfully',classes:"#43a047 green darken-1"})
                 M.Modal.getInstance(post.current).close();
                 clear();
                 history.push('/reload')
                
               }
             
             })
             .catch(err => setLoading(false))
        else
        {
        setLoading(false);
        clear();
        M.toast({html: "something went wrong",classes:"#43a047 red darken-1"})
        }
         
 
       
    })
    .catch(err=>{
      setLoading(false);
      clear();
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
       
         body:posttext,
         url:""
        })
      })
      .then(res => res.json())
      .then((data) => {
        setLoading(false);
          if(data.error)
          {
            M.toast({html: data.error,classes:"#c62828 red darken-3"})
            clear();
          }
          else
          {
            M.toast({html: 'Post created Successfully',classes:"#43a047 green darken-1"})
            M.Modal.getInstance(post.current).close()
            clear();
            history.push('/reload')
          }
        
        })
        .catch(err => { 
          setLoading(false);
          clear();
          M.toast({html: 'Something Went Wrong',classes:"#43a047 red darken-1"})
        })

}
const clear = () =>{
  document.getElementById('bodyc').value="";
  document.getElementById('imgc').value="";

  setBody("");
  setImage("");
}
  const renderList = () =>
  {
   if(state)
   {
     return[
       <>
         <nav style={{backgroundColor:navcolor,width:'100'}}>
      <div class="nav-wrapper"  >
      <Link style={{color:colour}} className="brand-logo" to="/">We Connect</Link>
      <a href="#" data-target="mobile-demo" class="sidenav-trigger" style={{color:colour}}><i class="material-icons">menu</i></a>
      <ul class="right hide-on-med-and-down">
       <li key="1"><i  data-target="modal1" className="large material-icons modal-trigger" style={{color:colour}}>search</i></li>
      <li key="2"><Link style={{color:colour}} to="/profile">Profile</Link></li>
      <li key="3"><Link data-target="modal2" className="modal-trigger" style={{color:colour}} >Create Post</Link></li>
      <li key="4"><Link style={{color:colour}} to="/myfollowing">Followings Posts</Link></li>
      
      <li key="5">
      <button className="btn waves-effect waves-light #64b5f6 red darken-1" style={{margin:4,color:'white'}} 
       onClick={()=>{
        localStorage.clear();
        M.Modal.getInstance(searchModal.current).close();
        setSearch('');
        clear();
        dispatch({type:'CLEAR'});
        history.push('/signin');
       }}
      >
         Log Out
      </button>
      </li> 
      </ul>
      </div>
      </nav>

      <ul class="sidenav" id="mobile-demo" ref={side} style={{backgroundColor:sidenavcolor,width:'100'}}>
      <li key="1"><i  data-target="modal1" className="large material-icons modal-trigger" style={{color:sidecolour,fontSize:20,marginLeft:30,marginTop:30}}>search</i></li>
      <li key="2"><Link style={{color:sidecolour}} to="/profile">Profile</Link></li>
      <li key="3"><Link data-target="modal2" className="modal-trigger"  >Create Post</Link></li>
      <li key="4"><Link style={{color:sidecolour}} to="/myfollowing">Followings Posts</Link></li>
     
      <li key="5">
      <button className="btn waves-effect waves-light #64b5f6 red darken-1" style={{margin:4,color:'white',marginLeft:30}} 
       onClick={()=>{
        localStorage.clear();
        M.Modal.getInstance(searchModal.current).close();
        setSearch('');
        clear();
        dispatch({type:'CLEAR'});
        history.push('/signin');
       }}
      >
       
   Log Out
      </button>
      </li>
      </ul>
      </>
     ]
   }
   else
   {
     return[
       <>
       <nav style={{width:'100',backgroundColor:navcolor}}>
      <div class="nav-wrapper" style={{color:'black !important'}} >
      <Link style={{color:colour}} className="brand-logo" to="/">We Connect</Link>
      <a href="#" data-target="mobile-demo" class="sidenav-trigger" style={{color:colour}}><i class="material-icons">menu</i></a>
      <ul class="right hide-on-med-and-down" style={{backgroundColor:navcolor,width:'100'}} >
      <li key="1" ><Link style={{color:colour}} to={state ? "/" :"/signin"}>Sign in</Link></li>
      <li key="2"><Link style={{color:colour}} to="/signup">Sign up</Link></li>
      </ul>
      </div>
      </nav>
      
      <ul class="sidenav" id="mobile-demo" ref={side}>
      <li key="1"><Link  style={{color:sidecolour}} to={state ? "/" :"/signin"}>Sign in</Link></li>
      <li key="2"><Link style={{color:sidecolour}}  to="/signup">Sign up</Link></li>
      </ul>
      </>
     ]
   }
  }
    return(
      
      <div>

      {renderList()}
     <div id="modal1" class="modal" ref={searchModal} style={{color:"black",overflowY:'scroll'}}>
          <div className="modal-content">
          <input
            type="text"
            placeholder="Search users by email or name"
            value={search}
            onChange={(e)=>fetchUsers(e.target.value)}
            />

          {localStorage.getItem("user") && localStorage.getItem("token") ? <> {userDetails.length>0 ? <ul  style={{color:'black'}}>
               {userDetails.filter(data=> data._id != state._id).map(item=>{
                 return <Link to={item._id !== state._id ? "/profile/"+item._id:'/profile'} onClick={(e)=>{
                  //  e.preventDefault()
                   M.Modal.getInstance(searchModal.current).close()
                   setSearch('')
                 }}>
                   <div style={{display:'flex',flexDirection:'row',marginTop:5}}>
                   <img style={{borderRadius:'40px',width:'40px',height:'40px'}} src={item.pic}/>
                   <span style={{marginTop:6,marginLeft:6}}>{item.name}</span>
                   <hr />
                   </div>
                   </Link> 
                })}
               
    </ul> : null}</> : null }
          </div>
          <div className="modal-footer">
            <button className="modal-close   btn-flat" 
            onClick={(e)=>{
              setSearch('');
              setUserDetails([]);
              M.Modal.getInstance(searchModal.current).close()
            }} 
            >
              close</button>
          </div>
        </div>
        

    <div id="modal2" class="modal" ref={post}>
    <div class="modal-content">
    <Link> <i className="material-icons" style={{
                        float:"right",
                        margin:5,
                        color:'grey'
                    }} 
                    onClick={()=>
                      {
                      M.Modal.getInstance(post.current).close();
                      clear();
                    }
                    }
            >clear</i></Link>
      <h4>Create Post</h4>

<textarea id="bodyc" style={style} onChange={(e)=>setBody(e.target.value)} placeholder="Write Something Here!!" maxlength="1000">
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
                 <input id="imgc" className="file-path" type="text" />
             </div>
             </div>
             {!loading ? <button disabled={loading} className="btn   #64b5f6 blue darken-1" onClick={()=>postDetails()}>
             create post
           </button> :  <CircularProgress size={30} className="loadingcolor"  />}
           <button style={{marginLeft:5}}  className="btn  #64b5f6 red darken-1"
            onClick={()=>{
             clear();
           }}>
             Clear All
            </button>
             
    </div>
    
  </div>
      
      </div>
    )
}

const style = {
  resize:'none',
  padding:'9px',
  height:'150px',
  fontSize:'15px',
  width:'800px',
  borderRadius:0
};
export default Navbar;


