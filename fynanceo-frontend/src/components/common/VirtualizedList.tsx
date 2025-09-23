import React from "react";
import {
  FixedSizeList as List,
  ListChildComponentProps,
} from "react-window";
import AutoSizer, { Size } from "react-virtualized-auto-sizer";
import { Box, Paper } from "@mui/material";

interface VirtualizedListProps<T> {
  items: T[];
  height?: number;
  itemHeight?: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  emptyMessage?: string;
}

export const VirtualizedList = <T,>({
  items,
  height = 400,
  itemHeight = 60,
  renderItem,
  emptyMessage = "Nenhum item encontrado",
}: VirtualizedListProps<T>) => {
  if (items.length === 0) {
    return (
      <Box
        height={height}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Paper sx={{ p: 3 }}>{emptyMessage}</Paper>
      </Box>
    );
  }

  return (
    <Box height={height}>
      <AutoSizer>
        {({ width, height }: Size) => (
          <List
            height={height}
            itemCount={items.length}
            itemSize={itemHeight}
            width={width}
          >
            {({ index, style }: ListChildComponentProps) => (
              <Box style={style}>{renderItem(items[index], index)}</Box>
            )}
          </List>
        )}
      </AutoSizer>
    </Box>
  );
};
