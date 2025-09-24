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
  Tooltip,
  Avatar,
  Chip,
  useTheme,
  alpha,
  Badge
} from '@mui/material';
import {
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
  TrendingUp,
  Circle,
  Notifications
} from '@mui/icons-material';

interface MenuItem {
  text: string;
  icon: React.ReactElement;
  path: string;
  children?: MenuItem[];
  badge?: string;
  isNew?: boolean;
}

const menuItems: MenuItem[] = [
  {
    text: 'Dashboard',
    icon: <Dashboard />,
    path: '/dashboard',
    isNew: true
  },
  {
    text: 'Clientes',
    icon: <People />,
    path: '/clientes',
    badge: '8'
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
      { text: 'Produtos', icon: <Circle sx={{ fontSize: 6 }} />, path: '/produtos' },
      { text: 'Categorias', icon: <Circle sx={{ fontSize: 6 }} />, path: '/categorias' },
      { text: 'Estoque', icon: <Circle sx={{ fontSize: 6 }} />, path: '/produtos/estoque', badge: '5' }
    ]
  },
  {
    text: 'Vendas',
    icon: <Receipt />,
    path: '/vendas',
    children: [
    
      { text: 'Histórico', icon: <Circle sx={{ fontSize: 6 }} />, path: '/vendas/historico' },
      { text: 'Relatórios', icon: <Circle sx={{ fontSize: 6 }} />, path: '/vendas/relatorios' }
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
  const theme = useTheme();
  const [openSubmenus, setOpenSubmenus] = useState<{ [key: string]: boolean }>({});

  const toggleSubmenu = (text: string) => {
    setOpenSubmenus(prev => ({
      ...prev,
      [text]: !prev[text]
    }));
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  // CORREÇÃO: Lógica melhorada para verificar item ativo
  const isActive = (item: MenuItem): boolean => {
    // Se é um item pai com children, verifica se algum child está ativo
    if (item.children) {
      return item.children.some(child => 
        location.pathname === child.path || location.pathname.startsWith(child.path + '/')
      );
    }
    
    // Para items sem children ou subitems, verifica match exato ou startsWith
    return location.pathname === item.path || location.pathname.startsWith(item.path + '/');
  };

  const isParentActive = (item: MenuItem): boolean => {
    return item.children ? item.children.some(child => isActive(child)) : false;
  };

  const renderMenuItem = (item: MenuItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isItemActive = isActive(item);
    const isParentItemActive = isParentActive(item);
    const isSubmenuOpen = openSubmenus[item.text];

    return (
      <Box key={item.text}>
        <ListItem disablePadding sx={{ display: 'block' }}>
          <ListItemButton
            onClick={() => {
              if (hasChildren) {
                toggleSubmenu(item.text);
                // Se é um item pai e não tem path específico, não navega
                if (item.path && !item.path.includes('/')) {
                  handleNavigation(item.path);
                }
              } else {
                handleNavigation(item.path);
              }
            }}
            sx={{
              minHeight: 42,
              justifyContent: open ? 'initial' : 'center',
              px: 2,
              pl: level > 0 ? 3 + level * 2 : 2,
              backgroundColor: isItemActive 
                ? alpha(theme.palette.primary.main, 0.15)
                : 'transparent',
              color: isItemActive 
                ? theme.palette.primary.main
                : theme.palette.text.primary,
              margin: '1px 8px',
              borderRadius: 2,
              transition: 'all 0.2s ease',
              position: 'relative',
              border: isItemActive 
                ? `1px solid ${alpha(theme.palette.primary.main, 0.3)}`
                : '1px solid transparent',
              '&:hover': {
                backgroundColor: isItemActive 
                  ? alpha(theme.palette.primary.main, 0.2)
                  : alpha(theme.palette.action.hover, 0.5),
                transform: 'translateX(4px)',
              },
              '& .MuiListItemIcon-root': {
                color: isItemActive ? theme.palette.primary.main : 'inherit',
                transition: 'color 0.2s ease'
              }
            }}
          >
            <Tooltip title={!open ? item.text : ''} placement="right" arrow>
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 2 : 'auto',
                  justifyContent: 'center',
                }}
              >
                {item.icon}
              </ListItemIcon>
            </Tooltip>

            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: isItemActive ? 600 : 400,
                      fontSize: '0.85rem',
                      color: 'inherit'
                    }}
                  >
                    {item.text}
                  </Typography>
                  {item.isNew && open && (
                    <Chip 
                      label="New" 
                      color="primary" 
                      size="small"
                      sx={{ 
                        height: 18,
                        fontSize: '0.6rem',
                        fontWeight: 600,
                      }}
                    />
                  )}
                </Box>
              }
              sx={{
                opacity: open ? 1 : 0,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            />

            {open && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {item.badge && (
                  <Box
                    sx={{
                      backgroundColor: theme.palette.error.main,
                      color: 'white',
                      borderRadius: '50%',
                      width: 18,
                      height: 18,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.6rem',
                      fontWeight: 'bold'
                    }}
                  >
                    {item.badge}
                  </Box>
                )}
                {hasChildren && (
                  <ExpandMore 
                    sx={{ 
                      color: 'inherit',
                      fontSize: '1rem',
                      transform: isSubmenuOpen ? 'rotate(180deg)' : 'none',
                      transition: 'transform 0.2s ease'
                    }}
                  />
                )}
              </Box>
            )}
          </ListItemButton>
        </ListItem>

        {hasChildren && open && (
          <Collapse in={isSubmenuOpen || isParentItemActive} timeout="auto" unmountOnExit>
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
        width: open ? width : 64,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? width : 64,
          boxSizing: 'border-box',
          transition: 'width 0.3s ease',
          overflowX: 'hidden',
          backgroundColor: theme.palette.background.paper,
          borderRight: `1px solid ${theme.palette.divider}`,
          boxShadow: '0 0 20px rgba(0,0,0,0.08)',
          display: 'flex',
          flexDirection: 'column'
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: open ? 'space-between' : 'center',
          p: open ? 2 : 1.5,
          minHeight: 60,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        {open ? (
          <>
            <Box display="flex" alignItems="center" gap={1.5}>
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  backgroundColor: theme.palette.primary.main,
                  color: '#ffffff',
                  fontWeight: 'bold',
                  fontSize: '0.9rem'
                }}
              >
                <TrendingUp />
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight="700" noWrap fontSize="1.1rem">
                  Fynanceo
                </Typography>
                <Typography variant="caption" color="text.secondary" fontSize="0.7rem">
                  BUSINESS ERP
                </Typography>
              </Box>
            </Box>
            <IconButton 
              onClick={onClose} 
              size="small"
              sx={{
                color: theme.palette.text.secondary,
                width: 28,
                height: 28,
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                }
              }}
            >
              <ChevronLeft fontSize="small" />
            </IconButton>
          </>
        ) : (
          <Avatar
            sx={{
              width: 32,
              height: 32,
              backgroundColor: theme.palette.primary.main,
              color: '#ffffff',
              fontWeight: 'bold',
              fontSize: '0.9rem'
            }}
          >
            <TrendingUp />
          </Avatar>
        )}
      </Box>

      {/* Menu Items */}
      <Box sx={{ flex: 1, overflow: 'auto', py: 1 }}>
        <List sx={{ p: 0.5 }}>
          {menuItems.map(item => renderMenuItem(item))}
        </List>
      </Box>

      {/* Footer */}
      <Box sx={{ 
        p: 1.5, 
        borderTop: `1px solid ${theme.palette.divider}`,
        backgroundColor: alpha(theme.palette.primary.main, 0.03)
      }}>
        {open ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Badge badgeContent={6} color="error" overlap="circular">
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  backgroundColor: theme.palette.info.main,
                  color: '#ffffff',
                  fontSize: '0.8rem'
                }}
              >
                <Notifications />
              </Avatar>
            </Badge>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography variant="body2" fontWeight="500" fontSize="0.8rem">
                Notificações
              </Typography>
              <Typography variant="caption" color="text.secondary" fontSize="0.7rem">
                6 novas
              </Typography>
            </Box>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Badge badgeContent={6} color="error" overlap="circular">
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  backgroundColor: theme.palette.info.main,
                  color: '#ffffff',
                  fontSize: '0.8rem'
                }}
              >
                <Notifications />
              </Avatar>
            </Badge>
          </Box>
        )}
      </Box>
    </Drawer>
  );
};

export default Sidebar;