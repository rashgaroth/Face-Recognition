import { PaletteOptions } from '@mui/material'
import { colors } from './colors'

export const palette = (mode: string) =>
  ({
    ...colors,
    mode: mode
  } as PaletteOptions)
