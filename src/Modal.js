// import React,{useState} from 'react';
// // import Modal from 'react-modal';
// import 'react-responsive-modal/styles.css';
// import { Modal } from 'react-responsive-modal';
// import ModalDialog from 'react-bootstrap/ModalDialog'

// const customStyles = {
//     content : {
//       top                   : '50%',
//       left                  : '50%',
//     //   right                 : 'auto',
//     //   bottom                : 'auto',
//       marginRight           : '-50%',
//       transform             : 'translate(-50%, -50%)',
//       width : '300px'
//     }
//   };
// const Modal1 = () =>
// {
//     const [isOpen,setOpen] = useState(false);
//     return(
//         // <div>
//         //     <Modal isOpen={isOpen} style={customStyles}>
//         //     <div style={{display:'flex',flexDirection:'row'}}>
//         //      <img style={{wdth:'50vh',height:'50vh',borderRadius:'50%'}} src={'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__340.jpg'} />
//         //      <p>Bharath</p>
//         //     </div>
//         //     <hr />
//         //     </Modal>
//         //     <button onClick={()=>setOpen(true)} >click</button>
//         // </div>
        // <div>
        //      <Modal open={true}  center>
        //      <div style={{display:'flex',flexDirection:'row'}}>
        //      <img style={{wdth:'50px',height:'50px',borderRadius:'500px'}} src={'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__340.jpg'} />
        //       <p>Bharath</p>
        //      </div>
         
//         // </Modal>
//         // </div>

//         <Modal
//       show={true}
//       size="lg"
//       aria-labelledby="contained-modal-title-vcenter"
//       centered
//     >
//       <Modal.Header closeButton>
//         <Modal.Title id="contained-modal-title-vcenter">
//           Modal heading
//         </Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         <h4>Centered Modal</h4>
//         <p>
//           Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
//           dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
//           consectetur ac, vestibulum at eros.
//         </p>
//       </Modal.Body>
//       <Modal.Footer>
//         {/* <Button >Close</Button> */}
//       </Modal.Footer>
//     </Modal>
//     )
// }

// export default Modal1;

import React, { useState, useEffect } from "react";
// import "./Header.css";
// import { CSSTransition } from "react-transition-group";

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

const Modal1 = () =>{
  const [open, setOpen] = React.useState(false);
const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  return(
    <div>
      <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open} >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Contact Us
        </DialogTitle>
        <DialogContent dividers>
          <Typography >
          
          
             <p style={{width:'400px'}}>Bharath</p>
             <hr />
          </Typography>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Modal1;