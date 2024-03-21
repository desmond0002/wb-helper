import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'


const initialState: any[] = []

export const splitsTableSlice = createSlice({
  name: 'splitsTable',
  initialState,
  reducers: {
    setSplitsTable: (state, action: PayloadAction<any[]>) => 
      state = [...action.payload] 
    ,
  },
})

export const { actions: SplitsTableActions } = splitsTableSlice
export const { reducer: SplitsTableReducer} = splitsTableSlice
