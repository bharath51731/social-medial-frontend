import React,{useState} from 'react';
import M from 'materialize-css';
import {url} from '../Url';
import {ekey} from '../Keys';
import { CircularProgress } from "@material-ui/core";
import {useHistory} from 'react-router-dom';

const Reset = () =>
{    
    const history = useHistory();
    const [email,setEmail] = useState("");
    let [loading,setLoading] = useState(false);

    
  if(localStorage.getItem("token") && localStorage.getItem("user"))
  {
   history.push('/');
  }

    const reset = (e) =>
    {
      e.preventDefault();
      
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email))
      {
        return M.toast({html: "Invalid Email",classes:"#43a047 red darken-1"})
      }
      setLoading(true);
      
        fetch(url+"reset/",{
            method:"put",
             headers:{
               "Content-Type":"application/json"
             },
             body: JSON.stringify({
                   email
               
             })
           })
           .then(res => res.json())
           .then(result => {
               setLoading(false)
               if(result.error)
               return  M.toast({html: result.error,classes:"#43a047 red darken-1"})
     
               else
               return  M.toast({html: 'Check Your Mail',classes:"#43a047 green darken-1"})
     
           })
           .catch(err => setLoading(false))
    
   
    }
    return(
        <div className="mycard" style={{marginTop:200}}>
        <div className="card auth-card input-field">
          <h2>We Connect</h2>
          <form
          onSubmit={(e)=>reset(e)}
          >
          <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          required
          />
        {!loading ?  
        <button 
          type="submit"
          className="btn  #64b5f6 blue darken-1"
          disabled={loading}
        >
            Reset Password
        </button>
           :<CircularProgress className="loadingcolor"  size={30} />}
          
          </form>
          
  
      </div>
    </div>
    )
}

export default Reset;