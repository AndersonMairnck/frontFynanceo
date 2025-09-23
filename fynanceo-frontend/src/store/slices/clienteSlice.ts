import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { Cliente, ClienteFormData, PaginatedResponse } from '../../types/cliente';
import { clienteService } from '../../services/clienteService';
interface ClienteState {
  clientes: Cliente[];
  clienteAtual: Cliente | null;
  loading: boolean;
  error: string | null;
  paginacao: {
    paginaAtual: number;
    itensPorPagina: number;
    totalItens: number;
    totalPaginas: number;
  };
  filtros: {
    busca: string;
  };
}

const initialState: ClienteState = {
  clientes: [],
  clienteAtual: null,
  loading: false,
  error: null,
  paginacao: {
    paginaAtual: 1,
    itensPorPagina: 10,
    totalItens: 0,
    totalPaginas: 0,
  },
  filtros: {
    busca: '',
  },
};

export const fetchClientes = createAsyncThunk(
  'clientes/fetchClientes',
  async (params: { page?: number; pageSize?: number; search?: string }) => {
    const response = await clienteService.listar(params.page, params.pageSize, params.search);
    return response;
  }
);

export const fetchClientePorId = createAsyncThunk(
  'clientes/fetchClientePorId',
  async (id: number) => {
    const response = await clienteService.obterPorId(id);
    return response;
  }
);

export const criarCliente = createAsyncThunk(
  'clientes/criarCliente',
  async (clienteData: ClienteFormData) => {
    const response = await clienteService.criar(clienteData);
    return response;
  }
);

export const atualizarCliente = createAsyncThunk(
  'clientes/atualizarCliente',
  async ({ id, clienteData }: { id: number; clienteData: ClienteFormData }) => {
    const response = await clienteService.atualizar(id, clienteData);
    return response;
  }
);

export const inativarCliente = createAsyncThunk(
  'clientes/inativarCliente',
  async (id: number) => {
    await clienteService.inativar(id);
    return id;
  }
);

export const ativarCliente = createAsyncThunk(
  'clientes/ativarCliente',
  async (id: number) => {
    await clienteService.ativar(id);
    return id;
  }
);

const clienteSlice = createSlice({
  name: 'clientes',
  initialState,
  reducers: {
    limparError: (state) => {
      state.error = null;
    },
    limparClienteAtual: (state) => {
      state.clienteAtual = null;
    },
    setFiltroBusca: (state, action) => {
      state.filtros.busca = action.payload;
    },
    setPaginaAtual: (state, action) => {
      state.paginacao.paginaAtual = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClientes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClientes.fulfilled, (state, action) => {
        state.loading = false;
        state.clientes = action.payload.items;
        state.paginacao = {
          paginaAtual: action.payload.pageNumber,
          itensPorPagina: action.payload.pageSize,
          totalItens: action.payload.totalCount,
          totalPaginas: action.payload.totalPages,
        };
      })
      .addCase(fetchClientes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao carregar clientes';
      })
      .addCase(fetchClientePorId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClientePorId.fulfilled, (state, action) => {
        state.loading = false;
        state.clienteAtual = action.payload;
      })
      .addCase(fetchClientePorId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao carregar cliente';
      })
      .addCase(criarCliente.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(criarCliente.fulfilled, (state, action) => {
        state.loading = false;
        state.clientes.unshift(action.payload);
      })
      .addCase(criarCliente.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao criar cliente';
      })
      .addCase(atualizarCliente.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(atualizarCliente.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.clientes.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.clientes[index] = action.payload;
        }
        if (state.clienteAtual?.id === action.payload.id) {
          state.clienteAtual = action.payload;
        }
      })
      .addCase(atualizarCliente.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao atualizar cliente';
      })
      .addCase(inativarCliente.fulfilled, (state, action) => {
        const index = state.clientes.findIndex(c => c.id === action.payload);
        if (index !== -1) {
          state.clientes[index].ativo = false;
        }
        if (state.clienteAtual?.id === action.payload) {
          state.clienteAtual.ativo = false;
        }
      })
      .addCase(ativarCliente.fulfilled, (state, action) => {
        const index = state.clientes.findIndex(c => c.id === action.payload);
        if (index !== -1) {
          state.clientes[index].ativo = true;
        }
        if (state.clienteAtual?.id === action.payload) {
          state.clienteAtual.ativo = true;
        }
      });
  },
});

export const {
  limparError,
  limparClienteAtual,
  setFiltroBusca,
  setPaginaAtual,
} = clienteSlice.actions;

export default clienteSlice;