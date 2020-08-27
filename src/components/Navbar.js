import React ,{useContext,useRef,useEffect,useState}from 'react';
import {Link,useHistory} from 'react-router-dom';
import {UserContext} from '../App';
import Load from './screens/Loading';
import '../App.css';
import M from 'materialize-css';
import {url} from './Url';

const colour = "black";
const Navbar = () =>
{
  const history = useHistory();

  // if(!localStorage.getItem("token") || !localStorage.getItem("user"))
  // {
  //    history.push('/signin')
  // }  

  const {state,dispatch} = useContext(UserContext)
  const  searchModal = useRef(null)
  const  side = useRef(null)
  const [search,setSearch] = useState('')
  const [userDetails,setUserDetails] = useState([])
  
  
  useEffect(()=>{
    M.Modal.init(searchModal.current);
    M.Sidenav.init(side.current);
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
  const renderList = () =>
  {
   if(state)
   {
     return[
       <>
         <nav style={{backgroundColor:'white',width:'100'}}>
      <div class="nav-wrapper"  >
      <Link style={{color:colour}} className="brand-logo" to="/">We Connect</Link>
      <a href="#" data-target="mobile-demo" class="sidenav-trigger" style={{color:colour}}><i class="material-icons">menu</i></a>
      <ul class="right hide-on-med-and-down">
       <li key="1"><i  data-target="modal1" className="large material-icons modal-trigger" style={{color:"black"}}>search</i></li>
      <li key="2"><Link style={{color:colour}} to="/profile">Profile</Link></li>
      <li key="3"><Link style={{color:colour}} to="/createpost">Create Post</Link></li>
      <li key="4"><Link style={{color:colour}} to="/myfollowing">Followings Posts</Link></li>
      {/* <li><Link to="/myposts">My Posts</Link></li> */}
      {/* <li><Link to={`/myposts/${state ? state._id : null}`}>My posts</Link></li> */}
      <li key="5"><Link
      style={{color:colour}}
       onClick={(e)=>{
      //e.preventDefault()
       localStorage.clear()
       dispatch({type:'CLEAR'})
       history.push('/signin')
      }}>Log Out</Link></li>
      </ul>
      </div>
      </nav>

      <ul class="sidenav" id="mobile-demo" ref={side}>
      <li key="1"><i  data-target="modal1" className="large material-icons modal-trigger" style={{color:"black",fontSize:20,marginLeft:20,marginTop:30}}>search</i></li>
      <li key="2"><Link to="/profile">Profile</Link></li>
      <li key="3"><Link to="/createpost">Create Post</Link></li>
      <li key="4"><Link to="/myfollowing">Followings Posts</Link></li>
      {/* <li><Link to="/myposts">My Posts</Link></li> */}
     {/* <li><Link to={`/myposts/${state ? state._id : null}`}>My posts</Link></li> */}
      <li key="5"><Link onClick={(e)=>{
      //e.preventDefault()
       localStorage.clear()
       dispatch({type:'CLEAR'})
       history.push('/signin')
      }}>Log Out</Link></li>
      </ul>
      </>
     ]
   }
   else
   {
     return[
       <>
       <nav style={{width:'100',backgroundColor:'white'}}>
      <div class="nav-wrapper" style={{color:'black !important'}} >
      <Link style={{color:colour}} className="brand-logo" to="/">We Connect</Link>
      <a href="#" data-target="mobile-demo" class="sidenav-trigger" style={{color:colour}}><i class="material-icons">menu</i></a>
      <ul class="right hide-on-med-and-down" >
      <li key="1" ><Link style={{color:colour}} to={state ? "/" :"/signin"}>Sign in</Link></li>
      <li key="2"><Link style={{color:colour}} to="/signup">Sign up</Link></li>
      </ul>
      </div>
      </nav>
      <ul class="sidenav" id="mobile-demo" ref={side}>
      <li key="1"><Link  to={state ? "/" :"/signin"}>Sign in</Link></li>
      <li key="2"><Link  to="/signup">Sign up</Link></li>
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

          {localStorage.getItem("user") && localStorage.getItem("token") ? <> {userDetails.length>0? <ul  style={{color:'black'}}>
               {userDetails.map(item=>{
                 return <Link to={item._id !== state._id ? "/profile/"+item._id:'/profile'} onClick={(e)=>{
                  //  e.preventDefault()
                   M.Modal.getInstance(searchModal.current).close()
                   setSearch('')
                 }}>
                   {/* <li className="collection-item" style={{color:'black'}}> */}
                   <div style={{display:'flex',flexDirection:'row',marginTop:5}}>
                   <img style={{borderRadius:'40px',width:'40px',height:'40px'}} src={item.pic}/>
                   <span style={{marginTop:6,marginLeft:6}}>{item.name}</span>
                   <hr />
                   </div>
                  
                   {/* </li> */}
                   </Link> 
                   
              
               })}
               
               
              </ul> : null}</> : null }
          </div>
          <div className="modal-footer">
            <button className="modal-close   btn-flat" 
            onClick={(e)=>{
              //e.preventDefault()
              setSearch('')
              M.Modal.getInstance(searchModal.current).close()
            }} 
            >
              close</button>
          </div>
        </div>
       {/* <Load /> */}
      </div>
    )
}
export default Navbar;

// #F08080

