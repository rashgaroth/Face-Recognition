import React from 'react'

type INvpButton = {
  loading?: boolean
  title: string
  onClick: () => void
  endIcon?: React.ReactNode
  startIcon?: React.ReactNode
}

export type { INvpButton }
