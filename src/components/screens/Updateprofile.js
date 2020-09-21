import React,{useEffect,useState,useContext}from 'react';
import {useHistory,Link} from 'react-router-dom';
import {UserContext} from '../../App';
import M from 'materialize-css';
import swal from 'sweetalert';
import { CircularProgress } from "@material-ui/core";
import {url} from '../Url';
import Loading from './Loading';
import {ckey} from '../Keys';

import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';

const size = 30;
const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const UpdateProfile = () =>
{ 
  
  const history = useHistory();
  const [posts,setPosts] = useState([]);
  const {state,dispatch} = useContext(UserContext)
  const [user,setuser] = useState(null)
  const [pass,setPass] = useState("")
  const [newpass,setnewPass] = useState("")
  const [delpass,setdelPass] = useState("")
  const [image,setImage] = useState("")
  const [name,setName]  = useState("")
  
  const [nload,setnLoad] = useState(false)
  const [pload,setpLoad] = useState(false)
  const [iload,setiLoad] = useState(false)
  const [riload,setriLoad] = useState(false)
  const [delload,setdelLoad] = useState(false)
  const [load,setLoad]= useState(true);
  const [list,setList] = useState([])
  const [heading,setHeading] = useState("")

  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  }


  if(!localStorage.getItem("token") || !localStorage.getItem("user"))
  {
   history.push('/signin');
  }
const fetchres= () =>
  {
    fetch(url+"mypost/",
    {
     headers:{
        "Authorization":'Bearer '+JSON.parse(localStorage.getItem("token"))
      },
     }
    )
    .then(res=>res.json())
    .then(data => {
      
      setLoad(false);
      setPosts(data.mypost)
      setuser(data.user)
    })
    .catch(err=>{
      setLoad(false)
      M.toast({html: 'Something Went Wrong',classes:"#43a047 red darken-1"})
    })
  }
  useEffect(()=>{
    
    fetchres();
  },[])

  const changename = () =>
  {
    let username = name.trim();
    if(username.length < 2)
    {
      return M.toast({html: "please enter your name",classes:"#43a047 red darken-1"})
    }
    setnLoad(true);
    fetch(url+"changename/",
    {
      method:"put",
      headers:{
        "Content-Type" : "application/json",
        "Authorization":'Bearer '+JSON.parse(localStorage.getItem("token"))
      },
   body:JSON.stringify({
        name:username
      })
     
    }
    )
    .then(res=>res.json())
    .then(data => {
      setnLoad(false);
      fetchres();
      setName("");
      M.toast({html: 'Name Changed',classes:"#43a047 green darken-1"})
     })
    .catch(err=>{
      setnLoad(false)
      M.toast({html: 'Something Went Wrong',classes:"#43a047 red darken-1"})
    })
  }

  const changeimage = () =>
  {
    if(!image)
    return M.toast({html: "please Upload image",classes:"#43a047 red darken-1"})
  const data = new FormData()
  data.append("file",image)
  data.append("upload_preset","social-app")
  data.append("cloud_name",ckey)
  if(image)
  {
    setiLoad(true)
  fetch(`https://api.cloudinary.com/v1_1/${ckey}/image/upload`,{
            method:"post",
            body:data
        })
        .then(res=>res.json())
        .then(data=>{
          fetch(url+"changepic/",{
            method:"put",
            headers:{
              "Authorization":"Bearer "+JSON.parse(localStorage.getItem("token")),
              "Content-Type":"application/json"
            },
            body: JSON.stringify({
              
              pic:data.url
            })
          })
          .then(res => res.json())
          .then(data => {
            setiLoad(false)
            fetchres();
            setImage("");
            M.toast({html: 'Profile Picture Updated',classes:"#43a047 green darken-1"})

          })
          .catch(err =>{ setiLoad(false)
            M.toast({html: 'Something Went Wrong',classes:"#43a047 red darken-1"})
          })

        })
        .catch(err=>{setiLoad(false)
          M.toast({html: 'Something Went Wrong',classes:"#43a047 red darken-1"})
        })
      }
  }
  

  const delpic = () =>{
    setriLoad(true)
    fetch(url+"delpic/",{
      method:"put",
      headers:{
        "Authorization":"Bearer "+JSON.parse(localStorage.getItem("token")),
       
      },
    })
    .then(res => res.json())
    .then(data => {
      setriLoad(false)
      fetchres()
      M.toast({html: 'Profile Picture Removed',classes:"#43a047 green darken-1"})
    })
    .catch(err => {
      setriLoad(false)
      M.toast({html: 'Something Went Wrong',classes:"#43a047 red darken-1"})
    })
  }
  const reset = () =>
  {
     if(newpass.length < 5)
      {
         return M.toast({html: 'password must be atleast 5 characters',classes:"#43a047 red darken-1"})
      }
      setpLoad(true);
     fetch(url+"changepass/",{
         method:"put",
         headers:{
           "Content-Type":"application/json",
           "Authorization":"Bearer "+JSON.parse(localStorage.getItem("token"))
         },
         body: JSON.stringify({
           oldpass:pass,
           newpass:newpass
         })
       })
       .then(res => res.json())
       .then(data =>{
         setpLoad(false)
           if(data.error)
            M.toast({html: data.error,classes:"#43a047 red darken-1"})
            else
            {
              setPass("");
              setnewPass("");
            M.toast({html: 'Password Updated',classes:"#43a047 green darken-1"})
            }
       })
       .catch(err=>{
        setpLoad(false)
        M.toast({html: 'Something Went Wrong',classes:"#43a047 red darken-1"})
       })
}

const delacc = () =>
{
     if(delpass.length < 5)
      {
         return M.toast({html: 'password must be atleast 5 characters',classes:"#43a047 red darken-1"})
      }

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
  setdelLoad(true)
  fetch(url+"delacc/",{
         method:"delete",
         headers:{
           "Content-Type":"application/json",
           "Authorization":"Bearer "+JSON.parse(localStorage.getItem("token"))
         },
         body:JSON.stringify({
           pass:delpass
         })
       })
       .then(res => res.json())
       .then(data =>{
        setdelLoad(false)
           if(data.error)
            M.toast({html: data.error,classes:"#43a047 red darken-1"})
            else if(data.message)
            {
            M.toast({html: 'Account has been Deleted',classes:"#43a047 green darken-1"})
            localStorage.clear()
            dispatch({type:"USER",payload:null})
            history.push('/signin')
           }
       })
       .catch(err=>{
        setdelLoad(false)
       })
      }
      })
      }
const setFollowers = () =>
{
if(user.followers.length >0)
 setOpen(true)
setHeading("Followers")
setList(user.followers)
}
const setFollowings = () =>
{
if(user.following.length >0)
setOpen(true)
setHeading("Following")
setList(user.following)
}
  return(

    <>
  {load ? <Loading /> :

     <div style={{maxWidth:"550px",margin:"10px auto"}}>
       <div style={{
         display:'flex',
        justifyContent:'space-around',
         marginLeft:'18px',
         borderBottom:'1px solid black',
         marginBottom:5
       }}>
         <div>
       <img style={{width:'160px',height:'160px',borderRadius:'80px',backgroundColor:'black'}} 
        src={user ? user.pic:""}
        />
       </div>
      
        <div >
        <h4 >{user? user.name : null }</h4>
        <h5>{ user ? user.email : null }</h5>
        
        <div style={{display:"flex",justifyContent:"space-between",width:"108%"}}>
          {user ?<Link> <h6 onClick={()=>setFollowers()} >{ user.followers.length} followers</h6></Link> : null}
          {user ? <Link><h6 onClick={()=>setFollowings()}>{ user.following.length} following</h6> </Link>: null}
          {user ? posts.length > 0 ? <h6><Link to={`/myposts/${user._id}`}>{posts.length} posts</Link></h6>: <h6>{posts.length} posts</h6>: null}
        </div>
       </div>
      </div>
      <h3>Edit Profile</h3>
     
 
        <input
      type="text"
      placeholder="Change Name"
      required
       value={name}
      onChange={(e)=>setName(e.target.value)}
      />
     {!nload ? <button disabled={nload} className="btn #64b5f6 blue darken-1"
      
       onClick={()=>changename()} >
       change name
      </button> : <CircularProgress size={size} className="loadingcolor" />}
      <br/> <br/>

      <div className="file-field input-field">
             <div className="btn #64b5f6 blue darken-1">
                 <span>Uplaod Image</span>
                 <input type="file" 
                 accept="image/*"  
                onChange={(e)=>setImage(e.target.files[0])}
                 />
             </div>
             <div className="file-path-wrapper">
                 <input className="file-path " type="text" />
             </div>
             </div>
             {!iload ? <button disabled={iload} className="btn #64b5f6 blue darken-1"
      
      onClick={()=>changeimage()} >
      update photo
     </button> : <CircularProgress size={size} className="loadingcolor" />}
     {!riload ? <button disabled={riload} style={{marginLeft:10}} className="btn  #64b5f6 red darken-1" 
      
      onClick={()=>delpic()} >
      remove photo
     </button> : <CircularProgress size={size} style={{marginLeft:30}} className="loadingcolor" />}
      <br/> <br/>
      
      <input
      type="password"
      placeholder="Old Password"
      value={pass}
      onChange={(e)=>setPass(e.target.value)}
      required />
       <input
      type="password"
      placeholder="New Password"
      value={newpass}
      onChange={(e)=>setnewPass(e.target.value)}
      required />
     {!pload ?  <button disabled={pload}  className="btn  #64b5f6 blue darken-1" onClick={()=>reset()} >
       change password
      </button> : <CircularProgress className="loadingcolor"  size={size} />}
      <br /><br />
       
      <input
      type="password"
      placeholder="Enter Your password"
      value={delpass}
      onChange={(e)=>setdelPass(e.target.value)}
      required />
     {!delload ?  <button disabled={delload}  className="btn  #64b5f6 red darken-1"  onClick={()=>delacc()} >
      delete my account
      </button> : <CircularProgress className="loadingcolor"  size={size} />}

      <div>
      <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open} >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          {heading}
        </DialogTitle>
        <DialogContent dividers>
          <Typography >
        {localStorage.getItem("user") && localStorage.getItem("token") ? <>   { user ? list.map((data,i)=>{

               return(
                 <>
                 <div key={i} style={{display:'flex',flexDirection:'row'}}>
                 <img src={data.pic} style={{width:'50px',height:'50px',borderRadius:'50%',display:'block'}} />
                 <Link to={data._id !== state._id ? "/profile/"+data._id:'/profile'}> <p style={{width:'400px',marginLeft:4}}>{data.name}</p></Link>
                 <hr />
               </div>
               </>
               )
             })   : null} </> : null}
        </Typography>
        </DialogContent>
      </Dialog>
    </div>
</div>

}</>
  )
}

export default UpdateProfile;