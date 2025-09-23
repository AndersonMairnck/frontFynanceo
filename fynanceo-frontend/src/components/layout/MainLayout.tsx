// MainLayout.tsx
import React from 'react';
import { Box, useTheme } from '@mui/material';
import Sidebar from './Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const theme = useTheme();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const sidebarWidth = 280;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar 
        open={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        width={sidebarWidth} 
      />
      
      {/* Conteúdo Principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          marginLeft: sidebarOpen ? 0 : `-${sidebarWidth}px`,
          width: sidebarOpen ? `calc(100% - ${sidebarWidth}px)` : '100%',
          maxWidth: '100%',
          overflow: 'auto'
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout;