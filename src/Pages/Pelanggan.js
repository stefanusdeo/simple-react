import {
  Card,
  CardContent,
  CardHeader,
  Dialog,
  Grid,
  Typography,
} from '@mui/material';
import { Stack } from '@mui/system';
import React, { useEffect, useState } from 'react';
import Page from '../components/Page';
import { LoadingButton } from '@mui/lab';
import axiosInstance from '../utils/axios';
import { FormPelanggan, TableList } from '../components/pelanggan';

export default function Pelanggan() {
  const [listData, setListData] = useState([]);
  const [contentAlert, setContentAlert] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const fetchingData = async () => {
    await axiosInstance.get('/api/pelanggan').then((res) => {
      setListData(res.data);
    });
  };

  const handleAdd = () => {
    setContentAlert(
      <>
        <FormPelanggan title='Form Add' handleClose={handleClose} />
      </>
    );
    setOpenDialog(true);
  };

  const handleClose = () => {
    setContentAlert(null);
    setOpenDialog(false);
    fetchingData();
  };

  useEffect(() => {
    fetchingData();
  }, []);

  return (
    <Page title='List Pelanggan'>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Typography variant='h4'>List Pelanggan</Typography>
        </Grid>
        <Grid item xs={12}>
          <Stack direction='column'>
            <Card>
              <CardHeader
                title='Pelanggan'
                action={
                  <LoadingButton variant='contained' onClick={handleAdd}>
                    Tambah Pelanggan
                  </LoadingButton>
                }
              />
              <CardContent>
                <TableList listData={listData} fatching={fetchingData} />
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>
      <Dialog
        open={openDialog}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        {contentAlert}
      </Dialog>
    </Page>
  );
}
