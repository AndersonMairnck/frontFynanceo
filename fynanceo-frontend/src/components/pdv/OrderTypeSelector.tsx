import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormControl
} from '@mui/material';
import { LocalDining, TakeoutDining, DeliveryDining } from '@mui/icons-material';
import { OrderType } from '../../types/order';

interface OrderTypeSelectorProps {
  selectedType: OrderType;
  onTypeChange: (type: OrderType) => void;
}

const OrderTypeSelector: React.FC<OrderTypeSelectorProps> = ({
  selectedType,
  onTypeChange
}) => {
  const types = [
    {
      value: 'dinein' as OrderType,
      label: 'Consumo no Local',
      icon: LocalDining,
      description: 'Cliente consome no estabelecimento',
      color: 'primary'
    },
    {
      value: 'takeaway' as OrderType,
      label: 'Retirada no Balcão',
      icon: TakeoutDining,
      description: 'Cliente retira o pedido',
      color: 'secondary'
    },
    {
      value: 'delivery' as OrderType,
      label: 'Delivery',
      icon: DeliveryDining,
      description: 'Entrega no endereço do cliente',
      color: 'success'
    }
  ];

  return (
    <FormControl component="fieldset" fullWidth>
      <Typography variant="h6" gutterBottom>
        Tipo de Venda
      </Typography>
      
      <RadioGroup
        value={selectedType}
        onChange={(e) => onTypeChange(e.target.value as OrderType)}
      >
        <Box display="flex" gap={2}>
          {types.map((type) => (
            <Card 
              key={type.value}
              sx={{ 
                flex: 1,
                cursor: 'pointer',
                border: selectedType === type.value ? 2 : 1,
                borderColor: selectedType === type.value ? `${type.color}.main` : 'divider',
                transition: 'all 0.2s',
                '&:hover': {
                  borderColor: `${type.color}.main`,
                  transform: 'translateY(-2px)'
                }
              }}
              onClick={() => onTypeChange(type.value)}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <FormControlLabel
                  value={type.value}
                  control={<Radio />}
                  label={
                    <Box>
                      <type.icon 
                        sx={{ 
                          fontSize: 40, 
                          color: `${type.color}.main`,
                          mb: 1 
                        }} 
                      />
                      <Typography variant="subtitle1" fontWeight="bold">
                        {type.label}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {type.description}
                      </Typography>
                    </Box>
                  }
                  sx={{ 
                    width: '100%',
                    margin: 0,
                    '& .MuiFormControlLabel-label': { width: '100%' }
                  }}
                />
              </CardContent>
            </Card>
          ))}
        </Box>
      </RadioGroup>
    </FormControl>
  );
};

export default OrderTypeSelector;