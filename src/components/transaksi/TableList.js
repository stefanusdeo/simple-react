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
import FormTransaksi from './FormTransaksi';

const LIST_HEAD = [
  { align: 'left', label: 'ID NOTA' },
  { align: 'right', label: 'Tanggal' },
  { align: 'right', label: 'Pelanggan' },
  { align: 'right', label: 'Barang' },
  { align: 'right', label: 'SubTotal' },
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
      .delete('/api/penjualan', { params: { id } })
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
    let rowData = {};
    let tempArr = [];
    data.items.map((row) => {
      tempArr.push(row.barang?.kode);
    });

    rowData = {
      id: data.id,
      id_nota: data.id_nota,
      items: tempArr,
      kode_pelanggan: data.kode_pelanggan,
      pelanggan: data.pelanggan,
      pelanggan_id: data.pelanggan_id,
      subtotal: data.subtotal,
      tgl: data.tgl,
    };

    setContentAlert(
      <>
        <FormTransaksi
          data={rowData}
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
                    {data.id_nota}
                  </TableCell>
                  <TableCell align='right'>{data.tgl}</TableCell>
                  <TableCell align='right'>{data.pelanggan.nama}</TableCell>
                  <TableCell align='right'>
                    {data.items?.map((val, i) => ` ${val.barang.nama},`)}
                  </TableCell>
                  <TableCell align='right'>{fNumber(data.subtotal)}</TableCell>
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
