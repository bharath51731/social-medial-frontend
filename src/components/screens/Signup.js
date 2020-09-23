import React,{useState} from 'react';
import {Link,useHistory} from 'react-router-dom';
import M from 'materialize-css';
import { CircularProgress } from "@material-ui/core";
import {url} from '../Url';
import {ekey,ckey} from '../Keys';
const Signup = () =>
{
  const history = useHistory();
  let [name,setName] = useState("");
  let [email,setEmail] = useState("");
  let [password,setPassword] = useState("");
  let [confirmPass,setConfirm] = useState("");
  let [image,setImage] = useState("");
  let [loading,setLoading] = useState(false);

  if(localStorage.getItem("token") && localStorage.getItem("user"))
  {
   history.push('/');
  }

  const create =  (e) =>
  {
    

    e.preventDefault();
    let username = name.trim();
    if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email))
      {
        return M.toast({html: "Invalid Email",classes:"#43a047 red darken-1"})
      }

    if(password.length <5)
    {
      return M.toast({html: "password must be atleast 5 characters",classes:"#43a047 red darken-1"})
    }
    if(username.length <2)
    {
     return  M.toast({html: "name must be atleast 2 characters",classes:"#43a047 red darken-1"})
    }
    if(password !== confirmPass)
    {
     return  M.toast({html: "password not matching",classes:"#43a047 red darken-1"})
    }
    setLoading(true);
    

    fetch(`https://emailverification.whoisxmlapi.com/api/v1?apiKey=${ekey}&emailAddress=${email}`)
    .then(res=>res.json())
    .then(data=>{
    
    if(data.dnsCheck === "false")
    {
      setLoading(false);
      return M.toast({html: "invalid email",classes:"#43a047 red darken-1"})
    }
    fetch(url+"signup/",{
      method:"post",
      headers:{
        "Content-Type":"application/json"
      },
      body: JSON.stringify({
        name:username,
        email,
        password,
        
      })
    })
    .then(res => res.json())
    .then(data => {
      setLoading(false);
      if(data.error)
      M.toast({html: data.error,classes:"#43a047 red darken-1"})
      else
      {
      M.toast({html: 'Account created',classes:"#43a047 green darken-1"})
      history.push('/signin')
      }
      
      })
    .catch(err =>{
       setLoading(false)
       M.toast({html: 'Something Went Wrong',classes:"#43a047 red darken-1"})
    })
}).catch(err=>{
    setLoading(false)
    M.toast({html: 'Something Went Wrong',classes:"#43a047 red darken-1"})
  })
}

  return(
    <div style={{marginTop:30}}>
    <div className="mycard">
    <div className="card auth-card input-field">
      <h2>We Connect</h2>
      <form onSubmit={(e)=>create(e)}>
      <input
      type="text"
      placeholder="Name"
      required
      value={name}
      onChange={(e)=>setName(e.target.value)}
     minLength="2"
     maxLength="20"
      />
      <input
      type="email"
      placeholder="Email address"
      required
      value={email}
      onChange={(e)=>setEmail(e.target.value)}
      />
      <input
      type="password"
      placeholder="Password"
      required
      value={password}
      onChange={(e)=>setPassword(e.target.value)}
      minLength="5"
      maxLength="12"
      />
       <input
      type="password"
      placeholder="Confirm Password"
      required
      value={confirmPass}
      onChange={(e)=>setConfirm(e.target.value)}
      minLength="5"
      maxLength="12"
      />

{!loading ? <button type="submit" disabled={loading} className="btn  #64b5f6 blue darken-1" >
                 signup
            </button> :  <CircularProgress className="loadingcolor"   />}
      </form>
      
          <Link to="/signin"><h5>Already have an account ?</h5></Link>
</div>
</div>
</div>
  )
}
export default Signup;