import React, { Fragment } from 'react';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { Form, FormikProvider, useFormik } from 'formik';
import { DialogContent, DialogTitle, Grid, TextField } from '@mui/material';
import { Box } from '@mui/system';
import { LoadingButton } from '@mui/lab';
import axiosInstance from '../../utils/axios';

export default function FormBarang({ isEdit, data, title, handleClose }) {
  const { enqueueSnackbar } = useSnackbar();

  const NewBarangSchema = Yup.object().shape({
    nama: Yup.string().required('Name is required'),
    kode: Yup.string().required('Kode is required'),
    kategori: Yup.string().required('Kategori is required'),
    harga: Yup.number().required('Number is required'),
  });

  const formIk = useFormik({
    initialValues: {
      id: data?.id || '',
      nama: data?.nama || '',
      kode: data?.kode || '',
      kategori: data?.kategori || '',
      harga: data?.harga || '',
    },
    validationSchema: NewBarangSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        if (isEdit) {
          await axiosInstance.put('/api/barang', values);
        }
        if (!isEdit) {
          await axiosInstance.post('/api/barang', values);
        }
        enqueueSnackbar('Berhasil Simpan Data', { variant: 'success' });
        handleClose();
        setSubmitting(false);
      } catch (error) {
        enqueueSnackbar('Gagal Simpan Data', { variant: 'error' });
        setSubmitting(false);
        setErrors(error);
      }
    },
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formIk;

  return (
    <Fragment>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <FormikProvider value={formIk}>
          <Form noValidate autoComplete='off' onSubmit={handleSubmit}>
            <Grid container spacing={1} sx={{ mt: 2 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label='Name'
                  {...getFieldProps('nama')}
                  error={Boolean(touched.nama && errors.nama)}
                  helperText={touched.nama && errors.nama}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label='Kode'
                  {...getFieldProps('kode')}
                  error={Boolean(touched.kode && errors.kode)}
                  helperText={touched.kode && errors.kode}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label='Kategori'
                  {...getFieldProps('kategori')}
                  error={Boolean(touched.kategori && errors.kategori)}
                  helperText={touched.kategori && errors.kategori}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label='Harga'
                  {...getFieldProps('harga')}
                  error={Boolean(touched.harga && errors.harga)}
                  helperText={touched.harga && errors.harga}
                />
              </Grid>
            </Grid>
            <Box sx={{ m: 4, display: 'flex', justifyContent: 'flex-end' }}>
              <LoadingButton
                type='submit'
                variant='contained'
                loading={isSubmitting}
              >
                {isEdit ? 'Edit' : 'Save'}
              </LoadingButton>
            </Box>
          </Form>
        </FormikProvider>
      </DialogContent>
    </Fragment>
  );
}
