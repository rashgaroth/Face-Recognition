import { PaletteOptions } from '@mui/material'
import { colors } from './colors'

export const componentStylesOverrides = (palette: PaletteOptions) => ({
  MuiButton: {
    styleOverrides: {
      root: {
        fontWeight: 500,
        borderRadius: '6px',
        // @ts-ignore
        backgroundColor: palette.primary?.main,
        '&:hover': {
          // @ts-ignore
          backgroundColor: palette.primary?.light
        }
      }
    }
  },
  MuiPaper: {
    defaultProps: {
      elevation: 0
    },
    styleOverrides: {
      root: {
        backgroundImage: 'none'
      },
      rounded: {
        borderRadius: `6px`
      }
    }
  }
})
