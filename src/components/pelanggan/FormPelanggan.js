import React, { Fragment } from 'react';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { Form, FormikProvider, useFormik } from 'formik';
import {
  DialogContent,
  DialogTitle,
  Grid,
  Menu,
  MenuItem,
  TextField,
} from '@mui/material';
import { Box } from '@mui/system';
import { LoadingButton } from '@mui/lab';
import axiosInstance from '../../utils/axios';

export default function FormPelanggan({ isEdit, data, title, handleClose }) {
  const { enqueueSnackbar } = useSnackbar();

  const NewBarangSchema = Yup.object().shape({
    nama: Yup.string().required('Name is required'),
    id_pelanggan: Yup.string().required('id_pelanggan is required'),
    domisili: Yup.string().required('Domisili is required'),
    jenis_kelamin: Yup.string().required('Jenis Kelamin is required'),
  });

  const formIk = useFormik({
    initialValues: {
      id: data?.id || '',
      nama: data?.nama || '',
      id_pelanggan: data?.id_pelanggan || '',
      domisili: data?.domisili || '',
      jenis_kelamin: data?.jenis_kelamin || '',
    },
    validationSchema: NewBarangSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        if (isEdit) {
          await axiosInstance.put('/api/pelanggan', values);
        }
        if (!isEdit) {
          await axiosInstance.post('/api/pelanggan', values);
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

  const {
    errors,
    touched,
    handleSubmit,
    isSubmitting,
    getFieldProps,
    values,
    setFieldValue,
  } = formIk;

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
                  label='ID Pelanggan'
                  {...getFieldProps('id_pelanggan')}
                  error={Boolean(touched.id_pelanggan && errors.id_pelanggan)}
                  helperText={touched.id_pelanggan && errors.id_pelanggan}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label='Domisili'
                  {...getFieldProps('domisili')}
                  error={Boolean(touched.domisili && errors.domisili)}
                  helperText={touched.domisili && errors.domisili}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label='Jenis Kelamin'
                  value={values.jenis_kelamin}
                  defaultValue={values.jenis_kelamin}
                  onChange={(event) =>
                    setFieldValue('jenis_kelamin', event.target.value)
                  }
                >
                  <MenuItem value='PRIA'>Pria</MenuItem>
                  <MenuItem value='WANITA'>Wanita</MenuItem>
                </TextField>
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
