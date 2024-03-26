import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { InitFileType } from '../../types/types'


const initialState: InitFileType[] = []

export const fileSlice = createSlice({
  name: 'file',
  initialState,
  reducers: {
    setFile: (state, action: PayloadAction<InitFileType[]>) => 
      action.payload
    ,
    updateByBarcode: (state, action: PayloadAction<InitFileType>) => 
    {
      const idx = state.findIndex(item => item.barcode === action.payload.barcode)
      if(idx != -1) state[idx] = action.payload
    }
  ,
  },
})

export const { actions: FileActions } = fileSlice
export const { reducer: FileReducer} = fileSlice
