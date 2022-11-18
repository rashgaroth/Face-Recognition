import { createTheme, Theme } from '@mui/material'
import { TypographyOptions } from '@mui/material/styles/createTypography'
import { componentStylesOverrides } from './componentStylesOverrides'
import { palette } from './palette'
import { typography } from './typography'

export type TTheme = {
  mode: 'light' | 'dark'
}

const theme = (conf: TTheme): Theme =>
  createTheme({
    palette: palette(conf.mode),
    components: componentStylesOverrides(palette(conf.mode)),
    typography: typography as TypographyOptions
  })

export default theme
