import * as React from 'react';
import { memo } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { ToastContainer, toast } from 'react-toastify';
import { useEffect } from 'react';
import { OpenInBrowserOutlined } from '@material-ui/icons';

function FormInputFeeInvoiceDialog(props) {
  const { open, onCloseFormDialog, onChangeValueSendMail, onSendMail } = props;

  useEffect(() => {
    console.log(open);
  }, [open]);
  return (
    <div>
      <Dialog open={open} onClose={onCloseFormDialog}>
        <DialogTitle>Nhập nội dung cần gửi</DialogTitle>
        <DialogContent>
          <DialogContentText>Hãy nhập nội dung cần gửi để người dùng có thể hiểu rõ được vấn đề</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Nhập nội dung"
            type="textarea"
            fullWidth
            variant="standard"
            onChange={(e) => onChangeValueSendMail(e)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onCloseFormDialog}>Hủy</Button>
          <Button color="error" variant="contained" onClick={onSendMail}>
            Gửi
          </Button>
        </DialogActions>
        <ToastContainer />
      </Dialog>
    </div>
  );
}
export default memo(FormInputFeeInvoiceDialog);
