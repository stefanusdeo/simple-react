import React, { useRef, useState } from 'react';
import { IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

export default function MoreMenu({ onDelete, handleEdit }) {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <IconButton ref={ref} onClick={() => setIsOpen(true)}>
        <MoreVertIcon width={20} height={20} />
      </IconButton>

      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { px: 1, width: 200, color: 'text.secondary' },
        }}
      >
        <MenuItem
          onClick={onDelete}
          sx={{ borderRadius: 1, typography: 'body2' }}
        >
          <DeleteIcon sx={{ mr: 2, width: 24, height: 24 }} />
          Delete
        </MenuItem>

        <MenuItem onClick={handleEdit}>
          <EditIcon sx={{ mr: 2, width: 24, height: 24 }} />
          Edit
        </MenuItem>
      </Menu>
    </>
  );
}
