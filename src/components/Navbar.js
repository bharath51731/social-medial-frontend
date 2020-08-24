import React ,{useContext,useRef,useEffect,useState}from 'react';
import {Link,useHistory} from 'react-router-dom';
import {UserContext} from '../App';
import Load from './screens/Loading';
import '../App.css';
import M from 'materialize-css';
import {url} from './Url';
const Navbar = () =>
{
  const history = useHistory();
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
         <nav>
      <div class="nav-wrapper" >
      <Link className="brand-logo" to="/">We Connect</Link>
      <a href="#" data-target="mobile-demo" class="sidenav-trigger"><i class="material-icons">menu</i></a>
      <ul class="right hide-on-med-and-down">
       <li key="1"><i  data-target="modal1" className="large material-icons modal-trigger" style={{color:"white"}}>search</i></li>
      <li><Link to="/profile">Profile</Link></li>
      <li><Link to="/createpost">Create Post</Link></li>
      <li><Link to="/myfollowing">Following Posts</Link></li>
      {/* <li><Link to="/myposts">My Posts</Link></li> */}
      <li><Link to={`/myposts/${state ? state._id : null}`}>My posts</Link></li>
      <li><Link onClick={(e)=>{
      e.preventDefault()
       localStorage.clear()
       dispatch({type:'CLEAR'})
       history.push('/signin')
      }}>Log Out</Link></li>
      </ul>
      </div>
      </nav>

      <ul class="sidenav" id="mobile-demo" ref={side}>
      <li key="1"><i  data-target="modal1" className="large material-icons modal-trigger" style={{color:"black",fontSize:40,marginLeft:10,marginTop:10}}>search</i></li>
      <li><Link to="/profile">Profile</Link></li>
      <li><Link to="/createpost">Create Post</Link></li>
      <li><Link to="/myfollowing">Following Posts</Link></li>
      {/* <li><Link to="/myposts">My Posts</Link></li> */}
     <li><Link to={`/myposts/${state ? state._id : null}`}>My posts</Link></li>
      <li><Link onClick={(e)=>{
      e.preventDefault()
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
       <nav style={{width:'100'}}>
      <div class="nav-wrapper" >
      <Link className="brand-logo" to="/">We Connect</Link>
      <a href="#" data-target="mobile-demo" class="sidenav-trigger"><i class="material-icons">menu</i></a>
      <ul class="right hide-on-med-and-down">
      <li><Link to={state ? "/" :"/signin"}>Sign in</Link></li>
      <li><Link to="/signup">Sign up</Link></li>
      </ul>
      </div>
      </nav>
      <ul class="sidenav" id="mobile-demo" ref={side}>
      <li><Link to={state ? "/" :"/signin"}>Sign in</Link></li>
      <li><Link to="/signup">Sign up</Link></li>
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
            placeholder="search users"
            value={search}
            onChange={(e)=>fetchUsers(e.target.value)}
            />

            {userDetails.length>0? <ul  style={{color:'black'}}>
               {userDetails.map(item=>{
                 return <Link to={item._id !== state._id ? "/profile/"+item._id:'/profile'} onClick={()=>{
                   M.Modal.getInstance(searchModal.current).close()
                   setSearch('')
                 }}>
                   {/* <li className="collection-item" style={{color:'black'}}> */}
                   <div style={{display:'flex',flexDirection:'row'}}>
                   <img style={{borderRadius:'40px',width:'40px',height:'40px'}} src={item.pic}/><p style={{marginBottom:4}}>{item.name}</p>
                   </div>
                   <hr />
                   {/* </li> */}
                   </Link> 
                   
              
               })}
               
               
              </ul> : null}
          </div>
          <div className="modal-footer">
            <button className="modal-close   btn-flat" onClick={()=>setSearch('')} >close</button>
          </div>
        </div>
       {/* <Load /> */}
      </div>
    )
}
export default Navbar;

// #F08080

