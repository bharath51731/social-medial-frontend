import React,{useEffect} from 'react';
import {useHistory} from 'react-router-dom';

const Reload = () =>{
    const history = useHistory();
    useEffect(() => {
        history.push('/');
      
    }, [])

    return(
    <>
    </>
    )
}

export default Reload;