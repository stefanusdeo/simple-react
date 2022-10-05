import { TableRow, TableHead, TableCell } from '@mui/material';
import React from 'react';

export default function TableHeader({ listHead }) {
  return (
    <TableHead>
      <TableRow>
        {listHead.map((row, i) => (
          <TableCell align={row.align} key={i}>
            {row.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
