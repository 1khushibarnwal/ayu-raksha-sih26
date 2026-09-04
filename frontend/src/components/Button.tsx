import type { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  variant?: 'primary' | 'secondary'
  type?: 'button' | 'submit' | 'reset'
  onClick?: () => void
  className?: string
}

function Button({
  children,
  variant = 'primary',
  type = 'button',
  onClick,
  className = '',
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`ayu-button ayu-button-${variant} ${className}`}
    >
      {children}
    </button>
  )
}

export default Button