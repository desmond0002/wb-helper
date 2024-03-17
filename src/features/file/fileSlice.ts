import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { InitFileType } from '../../types/types'


const initialState: InitFileType[] = []

export const fileSlice = createSlice({
  name: 'file',
  initialState,
  reducers: {
    setFile: (state, action: PayloadAction<any[]>) => 
      action.payload
    ,
  },
})

export const { actions: FileActions } = fileSlice
export const { reducer: FileReducer} = fileSlice
