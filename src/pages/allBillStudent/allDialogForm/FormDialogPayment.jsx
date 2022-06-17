import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { useState } from 'react';
import { memo } from 'react';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function FormDialogPayment(props) {
  const { open, onOpenDialog, onAgreeAction } = props;

  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={onOpenDialog}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{'Bạn đang thực hiện hành động thanh toán'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Bạn có muốn thanh toán hóa đơn này không
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="error" onClick={onOpenDialog} style={{ fontSize: '13px' }}>
            Không đồng ý
          </Button>

          <Button style={{ fontSize: '13px' }} variant="outlined" color="success" onClick={onAgreeAction}>
            Đồng ý
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
export default memo(FormDialogPayment);
