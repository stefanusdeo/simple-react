import {
  Dialog,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import axiosInstance from '../../utils/axios';
import { fNumber } from '../../utils/numberFormat';
import MoreMenu from '../MoreMenu';
import TableHeader from '../TableHeader';
import FormBarang from './FormBarang';

const LIST_HEAD = [
  { align: 'left', label: 'ID PELANGGAN' },
  { align: 'right', label: 'Nama' },
  { align: 'right', label: 'DOMISILI' },
  { align: 'right', label: 'JENIS KELAMIN' },
  { align: 'left', label: '' },
];

export default function TableList({ listData, fatching }) {
  const { enqueueSnackbar } = useSnackbar();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [contentAlert, setContentAlert] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDelete = async (id) => {
    await axiosInstance
      .delete('/api/barang', { params: { id } })
      .then((res) => {
        console.log(res);
        enqueueSnackbar('Success Delete data', { variant: 'success' });
        fatching();
        setPage(0);
        setRowsPerPage(5);
      })
      .catch((err) => {
        enqueueSnackbar('Failed Delete data', { variant: 'error' });
        console.log(err);
      });
  };

  const handleEdit = (data) => {
    setContentAlert(
      <>
        <FormBarang
          data={data}
          isEdit
          handleClose={handleClose}
          title='Form Edit'
        />
      </>
    );

    setOpenDialog(true);
  };

  const handleClose = () => {
    setContentAlert(null);
    setOpenDialog(false);
    fatching();
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHeader listHead={LIST_HEAD} />
          <TableBody>
            {listData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((data, i) => (
                <TableRow key={i}>
                  <TableCell component='th' scope='row'>
                    {data.kode}
                  </TableCell>
                  <TableCell align='right'>{data.nama}</TableCell>
                  <TableCell align='right'>{data.kategori}</TableCell>
                  <TableCell align='right'>{fNumber(data.harga)}</TableCell>
                  <TableCell align='center'>
                    <MoreMenu
                      onDelete={() => handleDelete(data.id)}
                      handleEdit={() => handleEdit(data)}
                    />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component='div'
          count={listData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
      <Dialog
        open={openDialog}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        {contentAlert}
      </Dialog>
    </>
  );
}
