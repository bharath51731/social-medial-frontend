import React,{useState,useContext,} from 'react'
import {Link,useHistory,useParams} from 'react-router-dom'
import M from 'materialize-css';
import {url} from '../Url';
import { CircularProgress } from "@material-ui/core";
const Newpass  = ()=>{
    const history = useHistory()
    const [password,setPasword] = useState("")
    const [confirmpassword,setConfirm] = useState("")
    let [loading,setLoading] = useState(false);
    const {token} = useParams()
    
    if(localStorage.getItem("token") && localStorage.getItem("user"))
  {
   history.push('/');
  }

    const Reset = (e)=>{

        e.preventDefault();
         if(password.length < 5)
         {
            return M.toast({html:"Password must be atleast 5 characters",classes:"#43a047 red darken-1"})
         } 
        if(password != confirmpassword)
        {
            return M.toast({html: 'Password Not Matching',classes:"#43a047 red darken-1"}) 
        }
       
        setLoading(true);
        fetch(url+"new-password",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                password,
                token
            })
        }).then(res=>res.json())
        .then(data=>{
            setLoading(false)
           if(data.error){
              M.toast({html: data.error,classes:"#43a047 red darken-1"})
           }
           else{

               M.toast({html:data.message,classes:"#43a047 green darken-1"})
               history.push('/signin')
           }
        }).catch(err=>{
            setLoading(false)
        })
    }
   return (
      <div className="mycard" style={{marginTop:200}}>
          <div className="card auth-card input-field">
            <h2>We Connect</h2>
        <form  onSubmit={(e)=>Reset(e)}>
            <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e)=>setPasword(e.target.value)}
            required
            />
            <input
            type="password"
            placeholder="Confirm password"
            value={confirmpassword}
            onChange={(e)=>setConfirm(e.target.value)}
            required
            />
           <button 
           type="submit"
           className="btn waves-effect waves-light #64b5f6 blue darken-1"
          disabled={loading}
         >
            {loading ? <span><CircularProgress style={{color:'#64b5f6'}}  size={20} />Loading</span> : <>Update Password</>}
          </button>
          </form>
    
        </div>
      </div>
   )
}

export default Newpass;

