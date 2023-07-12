/* eslint-disable no-unused-vars */
import * as React from 'react'
import Grid from '@mui/material/Grid'
import Collapse from '@mui/material/Collapse'

export default function CollapsibleItem({ open, children, ...props }) {
  return (
    <Grid item xs={12} style={{ textAlign: 'center', padding: '0 12px' }}>
      <Collapse in={open}>
        <Grid container alignItems="center" justifyContent="center" {...props}>
          {children}
        </Grid>
      </Collapse>
    </Grid>
  )
}

export const MemoCollapsibleItem = React.memo(
  CollapsibleItem,
  (prev, next) => prev.open === next.open && prev.children === next.children,
)
