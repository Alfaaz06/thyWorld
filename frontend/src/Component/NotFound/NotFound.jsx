import React from 'react'
import { ErrorOutline } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import './NotFound.css'

export const NotFound = () => {
  return (
    <div className="notFoundBox">
      <div className="notFound">
        <ErrorOutline />
        <h1>Page not found</h1>
      </div>
      <Link to="/" >
        Back to Home
      </Link>
    </div>
  )
}
