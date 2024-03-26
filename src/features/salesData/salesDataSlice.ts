import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { SalesDataType } from '../../types/types'


const initialState: SalesDataType[] = []

export const salesDataSlice = createSlice({
  name: 'salesData',
  initialState,
  reducers: {
    setSalesData: (state, action: PayloadAction<any[]>) => 
      action.payload
    ,
  },
})

export const { actions: SalesDataActions } = salesDataSlice
export const { reducer: SalesDataReducer} = salesDataSlice
