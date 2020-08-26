import React,{useState} from 'react';
import M from 'materialize-css';
import {url} from '../Url';
import {ekey} from '../Keys';
import { CircularProgress } from "@material-ui/core";

const Reset = () =>
{
    const [email,setEmail] = useState("");
    let [loading,setLoading] = useState(false);

    const reset = () =>
    {
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email))
      {
        return M.toast({html: "Invalid Email",classes:"#c62828 red darken-3"})
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
          <input
          type="text"
          placeholder="email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          />
          <button className="btn waves-effect waves-light #64b5f6 blue darken-1"
          disabled={loading}
          onClick={()=>reset()}
          >
            {loading ? <span><CircularProgress style={{color:'#64b5f6'}}  size={20} />Loading</span> : <>Reset Password</>}
          </button>
          
  
      </div>
    </div>
    )
}

export default Reset;