import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { SplitType } from '../../types/types'


const initialState: SplitType[] = []

export const splitsSlice = createSlice({
  name: 'splits',
  initialState,
  reducers: {
    addWarehouse: (state, action: PayloadAction<string>) => 
      state = [...state, {name: action.payload, divider: 1}] 
    ,
    deleteWarehouse: (state, action: PayloadAction<string>) => 
      state = state.filter(item => item.name != action.payload)
    ,
    changeDevider: (state, action: PayloadAction<SplitType>) => {
      const idx = state.findIndex(item => item.name === action.payload.name)
      if(idx != -1) state[idx].divider = action.payload.divider
    },
  },
})

export const { actions: SplitsActions } = splitsSlice
export const { reducer: SplitsReducer} = splitsSlice
