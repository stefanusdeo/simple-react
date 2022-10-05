import { useState } from 'react';
import './App.css';
import { Link, Route, Routes } from 'react-router-dom';
import Barang from './Pages/Barang';
import Pelanggan from './Pages/Pelanggan';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory';
import GroupIcon from '@mui/icons-material/Group';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import Transaksi from './Pages/Transaksi';

function App() {
  const [value, setValue] = useState('Barang');
  return (
    <>
      <Routes>
        <Route path='/' element={<Barang />} />
        <Route path='/pelanggan' element={<Pelanggan />} />
        <Route path='/transaksi' element={<Transaksi />} />
      </Routes>
      <Paper
        sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}
        elevation={3}
      >
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
        >
          <BottomNavigationAction
            label='Barang'
            component={Link}
            to='/'
            value='Barang'
            icon={<InventoryIcon />}
          />
          <BottomNavigationAction
            label='Pelanggan'
            component={Link}
            to='/pelanggan'
            value='Pelanggan'
            icon={<GroupIcon />}
          />
          <BottomNavigationAction
            label='Transaksi'
            component={Link}
            to='/transaksi'
            value='Transaksi'
            icon={<ReceiptLongIcon />}
          />
        </BottomNavigation>
      </Paper>
    </>
  );
}

export default App;
