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

function FormDialog(props) {
  const { open, onCloseFormDialog, onChangeReasonDeny, onDenyRegistration } = props;

  useEffect(() => {
    console.log(open);
  }, [open]);
  return (
    <div>
      <Dialog open={open} onClose={onCloseFormDialog}>
        <DialogTitle>Nhập lý do không chấp nhận</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn hãy thông báo cho người dùng biết lý do từ chối phiếu đăng ký này để họ có thể rút kinh nghiệm cho lần
            đăng ký sau
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Lý do bị từ chối"
            type="textarea"
            fullWidth
            variant="standard"
            onChange={(e) => onChangeReasonDeny(e)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onCloseFormDialog}>Hủy</Button>
          <Button color="error" variant="contained" onClick={onDenyRegistration}>
            Xác nhận từ chối
          </Button>
        </DialogActions>
        <ToastContainer />
      </Dialog>
    </div>
  );
}
export default memo(FormDialog);
