import React from 'react'
import { NavbarProps } from 'sanity'

export default function Navbar(props: NavbarProps) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 1rem',
      backgroundColor: '#F8F9FB',
      borderBottom: '1px solid #e5e7eb',
      height: '3.5rem'
    }}>
      {props.renderDefault(props)}
    </div>
  )
} 