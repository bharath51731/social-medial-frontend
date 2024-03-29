import React ,{useState,useContext}from 'react';
import {Link,useHistory} from 'react-router-dom';
import M from 'materialize-css';
import {UserContext} from '../../App';
import { CircularProgress } from "@material-ui/core";
import {url} from '../Url';

const Signin = () =>
{
  const history = useHistory();
  const {state,dispatch} = useContext(UserContext)
  let [email,setEmail] = useState("");
  let [password,setPassword] = useState("");
  let [loading,setLoading] = useState(false);


if(localStorage.getItem("token") && localStorage.getItem("user"))
  {
   history.push('/');
  }
  
  const login =  (e) =>
  {
    
    e.preventDefault();
    if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email))
    {
      return M.toast({html: "Invalid Email",classes:"#c62828 red darken-3"})
    }
    if(password.length < 5)
      {
         return M.toast({html: 'password must be atleast 5 characters',classes:"#43a047 red darken-1"})
      }
      setLoading(true);

    fetch(url+"signin/",{
    method:"post",
    headers:{
      "Content-Type":"application/json"
    },
    body: JSON.stringify({
      email,
      password
    })
  })
  .then(res => res.json())
  .then((data) => {
    setLoading(false);
    if(data.error)
    M.toast({html: data.error,classes:"#43a047 red darken-1"})
    else
    {
     localStorage.setItem("token",JSON.stringify(data.token));
     localStorage.setItem("user",JSON.stringify(data.user))
     dispatch({type:"USER",payload:data.user})
    
    
    M.toast({html: 'Successfully Signed in',classes:"#43a047 green darken-1"})
    
    history.push('/')
    }
    })
  .catch(err =>
    {
      setLoading(false);
      M.toast({html: 'Something Went Wrong',classes:"#43a047 red darken-1"})
    })
}
return(
    <div style={{marginTop:150}}>

    <div className="mycard" >
    <div className="card auth-card input-field">
      <h2>We Connect</h2>
      <form onSubmit={(e)=>login(e)}>
      <input
      type="email"
      placeholder="Email address"
      required
      onChange={(e)=>setEmail(e.target.value)}
      />
      <input
      type="password"
      required
      placeholder="Password"
      onChange={(e)=>setPassword(e.target.value)}
      minLength="5"
      maxLength="12"
      />
     {!loading ? <button
       className="ldbtn" disabled={loading} type="submit" className="btn  #64b5f6 blue darken-1" 
       style={{backgroundColor:'#34495E !important'}} 
       >
      Sign in
      </button> : <CircularProgress className="loadingcolor" style={{marginTop:5}}   />}
      </form>
      <h5>
          <Link to="/signup">Dont have an account ?</Link>
      </h5>
      <h6>
    <Link to="/reset">Forgot password ?</Link>
      </h6>
</div>
</div>
</div>
  )
}

export default Signin;