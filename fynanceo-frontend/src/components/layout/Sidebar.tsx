import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
  Collapse,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Menu as MenuIcon,
  ChevronLeft,
  Dashboard,
  People,
  PointOfSale,
  Inventory,
  Receipt,
  Assessment,
  Settings,
  ExpandLess,
  ExpandMore,
  Store
} from '@mui/icons-material';

// Interface para itens do menu
interface MenuItem {
  text: string;
  icon: React.ReactElement;
  path: string;
  children?: MenuItem[];
}

// Itens do menu principal
const menuItems: MenuItem[] = [
  {
    text: 'Dashboard',
    icon: <Dashboard />,
    path: '/dashboard'
  },
  {
    text: 'Clientes',
    icon: <People />,
    path: '/clientes'
  },
  {
    text: 'Ponto de Venda',
    icon: <PointOfSale />,
    path: '/pdv'
  },
  {
    text: 'Produtos',
    icon: <Inventory />,
    path: '/produtos',
    children: [
      { text: 'Cadastro', icon: <Inventory />, path: '/produtos' },
      { text: 'Categorias', icon: <Inventory />, path: '/produtos/categorias' },
      { text: 'Estoque', icon: <Inventory />, path: '/produtos/estoque' }
    ]
  },
  {
    text: 'Vendas',
    icon: <Receipt />,
    path: '/vendas',
    children: [
      { text: 'Histórico', icon: <Receipt />, path: '/vendas' },
      { text: 'Relatórios', icon: <Assessment />, path: '/vendas/relatorios' }
    ]
  },
  {
    text: 'Relatórios',
    icon: <Assessment />,
    path: '/relatorios'
  },
  {
    text: 'Configurações',
    icon: <Settings />,
    path: '/configuracoes'
  }
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  width: number;
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose, width }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [openSubmenus, setOpenSubmenus] = useState<{ [key: string]: boolean }>({});

  // Alternar submenu
  const toggleSubmenu = (text: string) => {
    setOpenSubmenus(prev => ({
      ...prev,
      [text]: !prev[text]
    }));
  };

  // Navegar para uma rota
  const handleNavigation = (path: string) => {
    navigate(path);
    // Fechar sidebar em dispositivos móveis
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  // Verificar se um item está ativo
  const isActive = (path: string, children?: MenuItem[]): boolean => {
    if (location.pathname === path) return true;
    
    if (children) {
      return children.some(child => location.pathname.startsWith(child.path));
    }
    
    return location.pathname.startsWith(path);
  };

  // Renderizar um item do menu
  const renderMenuItem = (item: MenuItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isItemActive = isActive(item.path, item.children);
    const isSubmenuOpen = openSubmenus[item.text];

    return (
      <Box key={item.text}>
        <ListItem disablePadding sx={{ display: 'block' }}>
          <ListItemButton
            onClick={() => {
              if (hasChildren) {
                toggleSubmenu(item.text);
              } else {
                handleNavigation(item.path);
              }
            }}
            sx={{
              minHeight: 48,
              justifyContent: open ? 'initial' : 'center',
              px: 2.5,
              pl: level > 0 ? 4 + level * 2 : 2.5,
              backgroundColor: isItemActive ? 'primary.light' : 'transparent',
              color: isItemActive ? 'primary.contrastText' : 'text.primary',
              '&:hover': {
                backgroundColor: isItemActive ? 'primary.main' : 'action.hover',
              },
              margin: '2px 8px',
              borderRadius: 1,
            }}
          >
            <Tooltip title={!open ? item.text : ''} placement="right">
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                  color: 'inherit',
                }}
              >
                {item.icon}
              </ListItemIcon>
            </Tooltip>
            
            <ListItemText 
              primary={item.text} 
              sx={{ 
                opacity: open ? 1 : 0,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }} 
            />
            
            {hasChildren && open && (
              <Box sx={{ ml: 1 }}>
                {isSubmenuOpen ? <ExpandLess /> : <ExpandMore />}
              </Box>
            )}
          </ListItemButton>
        </ListItem>

        {/* Submenu */}
        {hasChildren && open && (
          <Collapse in={isSubmenuOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children!.map(child => renderMenuItem(child, level + 1))}
            </List>
          </Collapse>
        )}
      </Box>
    );
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? width : 56,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? width : 56,
          boxSizing: 'border-box',
          transition: 'width 0.3s ease',
          overflowX: 'hidden',
          bgcolor: 'background.paper',
          borderRight: '1px solid',
          borderColor: 'divider',
        },
      }}
    >
      {/* Cabeçalho da Sidebar */}
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: open ? 'space-between' : 'center',
          p: 1, 
          minHeight: 64 
        }}
      >
        {open ? (
          <>
            <Box display="flex" alignItems="center" gap={1}>
              <Store color="primary" />
              <Typography variant="h6" noWrap>
                Fynanceo ERP
              </Typography>
            </Box>
            <IconButton onClick={onClose} size="small">
              <ChevronLeft />
            </IconButton>
          </>
        ) : (
          <IconButton onClick={() => {}} size="small">
            <MenuIcon />
          </IconButton>
        )}
      </Box>

      <Divider />

      {/* Menu de Navegação */}
      <List sx={{ flexGrow: 1, px: 1 }}>
        {menuItems.map(item => renderMenuItem(item))}
      </List>

      {/* Rodapé da Sidebar */}
      <Box sx={{ p: 2 }}>
        <Divider sx={{ mb: 2 }} />
        {open && (
          <Typography 
            variant="caption" 
            color="text.secondary" 
            align="center"
            sx={{ display: 'block' }}
          >
            v1.0.0
          </Typography>
        )}
      </Box>
    </Drawer>
  );
};

export default Sidebar;