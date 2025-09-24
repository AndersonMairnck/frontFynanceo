import React from 'react';
import {
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Chip,
  Box
} from '@mui/material';
import { Category } from '../../types/category';

interface CategorySelectProps {
  categories: Category[];
  selectedCategoryId: number;
  onCategoryChange: (categoryId: number) => void;
  error?: boolean;
  helperText?: string;
  label?: string;
  multiple?: boolean;
}

export const CategorySelect: React.FC<CategorySelectProps> = ({
  categories,
  selectedCategoryId,
  onCategoryChange,
  error = false,
  helperText,
  label = 'Categoria',
  multiple = false
}) => {
  const categoriasAtivas = categories.filter(cat => cat.isActive);

  return (
    <FormControl fullWidth error={error}>
      <InputLabel>{label}</InputLabel>
      <Select
        value={multiple ? [selectedCategoryId] : selectedCategoryId} // Corrigir para múltiplo
        onChange={(e) => onCategoryChange(Number(e.target.value))}
        label={label}
        multiple={multiple}
        renderValue={multiple ? (selected) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {(selected as number[]).map((value) => {
              const category = categoriasAtivas.find(cat => cat.id === value);
              return category ? (
                <Chip key={value} label={category.name} size="small" />
              ) : null;
            })}
          </Box>
        ) : undefined}
      >
        <MenuItem value={0}>
          <em>Selecione uma categoria</em>
        </MenuItem>
        {categoriasAtivas.map((category) => (
          <MenuItem key={category.id} value={category.id}>
            {category.name}
          </MenuItem>
        ))}
      </Select>
      {helperText && (
        <Box component="p" sx={{ color: error ? 'error.main' : 'text.secondary', fontSize: '0.75rem', mt: 0.5 }}>
          {helperText}
        </Box>
      )}
    </FormControl>
  );
};

export default CategorySelect;