import React,{useEffect,createContext,useReducer,useContext} from 'react';
import Navbar from './components/Navbar';
import './App.css';
import {BrowserRouter,Route,Switch,useHistory} from 'react-router-dom';
import Home from './components/screens/Home';
import Profile from './components/screens/profile';
import Signin from './components/screens/Signin';
import Signup from './components/screens/Signup';
import Userprofile from './components/screens/UserProfile';
import CreatePost from './components/screens/Createpost';
import Myfollowings from './components/screens/Myfollowingposts';
import Myposts from './components/screens/Mypots';
import ViewFull from './components/screens/ViewFull';
import {reducer, initialState} from './reducer/userReducer';
import './components/screens/Header.css';
import Reset from './components/screens/Reset';
export const UserContext = createContext();

const Routing = () =>{
  const history = useHistory();
  const {state,dispatch} = useContext(UserContext)
  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user"))
    if(user)
    {
      dispatch({type:'USER',payload:user})
    }
    else
    {
      history.push('/signin')
    }
    
  },[])
  return(
<Switch>
<Route exact path="/" component={Home} />
   <Route exact  path="/profile" component={Profile} />
   <Route exact path="/signin" component={Signin} />
   <Route exact path="/signup" component={Signup} />
   <Route exact path="/createpost" component={CreatePost} />
   <Route exact path="/profile/:id" component={Userprofile} />
   <Route exact path="/myfollowing" component={Myfollowings} />
   <Route exact path="/myposts/:id" component={Myposts} />
   <Route exact path="/viewfull/:id" component={ViewFull} />
   <Route path="/reset" component={Reset} />
</Switch>
  )
}
function App() {
 const [state,dispatch] = useReducer(reducer,initialState);
  return (
    <UserContext.Provider value={{state,dispatch}}>
 <BrowserRouter>
   <Navbar />
   <Routing />
   </BrowserRouter>
   </UserContext.Provider>
  );
}
export default App;
