import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';

type ConfirmDialogProps = {
  open: boolean;
  onClose: () => void;  // We expect onClose to close the dialog
  onConfirm: () => void; // We expect onConfirm to execute the delete action
  title: string;
  message: string;
};

const ConfirmDialog = ({ open, onClose, onConfirm, title, message }: ConfirmDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <p>{message}</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button
          onClick={() => {
            onConfirm(); // Call onConfirm when confirmed
            onClose(); // Close dialog after confirmation
          }}
          color="secondary"
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
