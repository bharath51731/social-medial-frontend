import React from 'react';
import Loading from 'react-loading-components';
 
const Load = () => (
   <div
   style={{
    position: 'absolute',
    top: '50%',
    left: '50%',
    margin: '-25px 0 0 -25px'
   }}
   >
  <Loading type='ball_triangle' width={100} height={100} fill='blue' />
  </div>

);
 
export default Load;