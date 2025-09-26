// src/components/orders/StatusBadge.tsx
import React from 'react';
import { Chip, Box } from '@mui/material';
import { 
  AccessTime, 
  Restaurant, 
  DirectionsBike, 
  CheckCircle, 
  Cancel,
  LocalShipping 
} from '@mui/icons-material';

interface StatusBadgeProps {
  status: string;
  size?: 'small' | 'medium';
}

const statusConfig = {
  Pendente: { 
    label: 'Pendente', 
    color: 'warning' as const, 
    icon: <AccessTime /> 
  },
  EmPreparo: { 
    label: 'Em Preparo', 
    color: 'info' as const, 
    icon: <Restaurant /> 
  },
  EmRota: { 
    label: 'Em Rota', 
    color: 'secondary' as const, 
    icon: <DirectionsBike /> 
  },
  SaiuParaEntrega: { 
    label: 'Saiu para Entrega', 
    color: 'primary' as const, 
    icon: <LocalShipping /> 
  },
  Entregue: { 
    label: 'Entregue', 
    color: 'success' as const, 
    icon: <CheckCircle /> 
  },
  Cancelado: { 
    label: 'Cancelado', 
    color: 'error' as const, 
    icon: <Cancel /> 
  }
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'medium' }) => {
  const config = statusConfig[status as keyof typeof statusConfig] || { 
    label: status, 
    color: 'default' as const, 
    icon: <AccessTime /> 
  };

  return (
    <Chip
      icon={config.icon}
      label={config.label}
      color={config.color}
      size={size}
      variant="filled"
      sx={{ 
        fontWeight: 600,
        minWidth: size === 'small' ? 100 : 120
      }}
    />
  );
};

export default StatusBadge;