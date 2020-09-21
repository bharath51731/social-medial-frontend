import React,{useEffect,useState,useContext}from 'react';
import {useHistory,Link} from 'react-router-dom';
import {UserContext} from '../../App';
import M from 'materialize-css';
import swal from 'sweetalert';
import { CircularProgress } from "@material-ui/core";
import '../../App.css';
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

const Profile = () =>
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
         <button 
      style={{marginBottom:5,marginLeft:25,color:'white',backgroundColor:'#0080ff',border:'none',width:'120px',height:'40px',borderRadius:'2px'}}
      onClick={()=>history.push('/updateprofile')}
      
      >
        <Link style={{color:'white'}}>Edit Profile</Link></button>
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
     
    <div className="gallery" style={{marginTop:10}}>
               {
                  posts.filter(data => data.photo != "").map((item,i)=>{
                       return(
                        <img key={i} className="item" src={item.photo} style={{marginTop:10}} /> 
                        
                       )
                   })
               }
      </div>
       

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
// style={{fontFamily:"'Dancing Script', 'cursive'"}}

export default Profile;