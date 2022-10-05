import React, { Fragment, useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { Form, FormikProvider, useFormik } from 'formik';
import {
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
} from '@mui/material';
import { Box } from '@mui/system';
import {
  DatePicker,
  LoadingButton,
  LocalizationProvider,
  MobileDatePicker,
} from '@mui/lab';
import axiosInstance from '../../utils/axios';
import AdapterDayjs from '@mui/lab/AdapterDayjs';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function FormTransaksi({ isEdit, data, title, handleClose }) {
  const { enqueueSnackbar } = useSnackbar();
  const [listPelanggan, setListPelanggan] = useState([]);
  const [listBarang, setListBarang] = useState([]);

  const NewPenjualanSchema = Yup.object().shape({
    id_nota: Yup.string().required('Nota Id is required'),
    kode_pelanggan: Yup.string().required('Pelanggan is required'),
    kode_barang: Yup.array().required('Barang is required'),
  });

  const formIk = useFormik({
    initialValues: {
      id: data?.id || '',
      id_nota: data?.id_nota || '',
      kode_pelanggan: data?.kode_pelanggan || '',
      tgl: data?.tgl || '',
      kode_barang: data?.items || [],
      subtotal: data?.subtotal || '',
    },
    validationSchema: NewPenjualanSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        console.log(values);
        if (isEdit) {
          await axiosInstance.put('/api/penjualan', values);
        }
        if (!isEdit) {
          await axiosInstance.post('/api/penjualan', values);
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

  const fetchingBarang = async () => {
    await axiosInstance.get('/api/barang').then((res) => {
      setListBarang(res.data);
    });
  };

  const fetchingPelanggan = async () => {
    await axiosInstance.get('/api/pelanggan').then((res) => {
      setListPelanggan(res.data);
    });
  };

  useEffect(() => {
    fetchingPelanggan();
    fetchingBarang();
  }, []);

  return (
    <Fragment>
      {/* <LocalizationProvider dateAdapter={AdapterDayjs}> */}
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <FormikProvider value={formIk}>
          <Form noValidate autoComplete='off' onSubmit={handleSubmit}>
            <Grid container spacing={1} sx={{ mt: 2 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label='ID Nota'
                  {...getFieldProps('id_nota')}
                  error={Boolean(touched.id_nota && errors.id_nota)}
                  helperText={touched.id_nota && errors.id_nota}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label='Kode Pelanggan'
                  value={values.kode_pelanggan}
                  defaultValue={values.kode_pelanggan}
                  onChange={(event) =>
                    setFieldValue('kode_pelanggan', event.target.value)
                  }
                >
                  {listPelanggan.map((val, i) => (
                    <MenuItem key={i} value={val.id_pelanggan}>
                      {val.nama}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel id='barang'>Barang</InputLabel>
                  <Select
                    fullWidth
                    labelId='barang'
                    id='barang'
                    multiple
                    value={values.kode_barang}
                    onChange={(event) => {
                      const {
                        target: { value },
                      } = event;
                      setFieldValue(
                        'kode_barang',
                        // On autofill we get a stringified value.
                        typeof value === 'string' ? value.split(',') : value
                      );
                    }}
                    input={<OutlinedInput label='Barang' />}
                    MenuProps={MenuProps}
                  >
                    {listBarang.map((val, i) => (
                      <MenuItem key={i} value={val.kode}>
                        {`${val.nama}-${val.kategori}`}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type='date'
                  value={values.tgl}
                  onChange={(value) => setFieldValue('tgl', value.target.value)}
                />
                {/* <DatePicker
                    label='Tanggal'
                    inputFormat='MM/DD/YYYY'
                    value={values.tgl}
                    onChange={(value) => setFieldValue('tgl', value)}
                    renderInput={(params) => <TextField {...params} />}
                  /> */}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label='SubTotal'
                  {...getFieldProps('subtotal')}
                  error={Boolean(touched.subtotal && errors.subtotal)}
                  helperText={touched.subtotal && errors.subtotal}
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
      {/* </LocalizationProvider> */}
    </Fragment>
  );
}
