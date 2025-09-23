import React, { Suspense } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

interface LazyLoadProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const DefaultFallback: React.FC = () => (
  <Box 
    display="flex" 
    justifyContent="center" 
    alignItems="center" 
    minHeight="200px"
    flexDirection="column"
    gap={2}
  >
    <CircularProgress />
    <Typography variant="body2" color="textSecondary">
      Carregando...
    </Typography>
  </Box>
);

export const LazyLoad: React.FC<LazyLoadProps> = ({ 
  children, 
  fallback = <DefaultFallback /> 
}) => {
  return <Suspense fallback={fallback}>{children}</Suspense>;
};