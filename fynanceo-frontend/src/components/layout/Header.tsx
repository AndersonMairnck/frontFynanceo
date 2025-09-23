import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button
} from '@mui/material';
import { Store, Menu as MenuIcon } from '@mui/icons-material';

interface HeaderProps {
  onMenuToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  return (
    <AppBar position="static" elevation={2}>
      <Toolbar>
        <Button
          color="inherit"
          onClick={onMenuToggle}
          sx={{ mr: 2, display: { xs: 'block', md: 'none' } }}
        >
          <MenuIcon />
        </Button>

        <Box display="flex" alignItems="center" flexGrow={1}>
          <Store sx={{ mr: 2 }} />
          <Typography variant="h6" component="div">
            Fynanceo ERP
          </Typography>
        </Box>

        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
          <Button color="inherit" href="/clientes">
            Clientes
          </Button>
          <Button color="inherit" href="/vendas">
            Vendas
          </Button>
          <Button color="inherit" href="/produtos">
            Produtos
          </Button>
          <Button color="inherit" href="/relatorios">
            Relatórios
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;