import React from 'react'
import { LoadingButton } from '@mui/lab'
import { INvpButton } from 'types/button'

const NvPButton = (props: INvpButton) => {
  return (
    <LoadingButton sx={{ mt: 2, mr: 2 }} className="w-full" loading={props.loading || false} onClick={props.onClick}>
      <p className="text-white">
        {props.title} {props.endIcon}
      </p>
    </LoadingButton>
  )
}

export default NvPButton
