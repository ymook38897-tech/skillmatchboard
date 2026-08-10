import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'
  children: React.ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2'

  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 disabled:hover:bg-primary-600 focus-visible:ring-primary-600',
    secondary: 'bg-primary-50 text-primary-600 border-2 border-primary-200 hover:border-primary-300 hover:bg-primary-100 focus-visible:ring-primary-600',
    outline: 'border-2 border-gray-300 text-gray-900 hover:bg-gray-50 focus-visible:ring-gray-400',
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm min-h-10',
    md: 'px-6 py-3 text-base min-h-12',
    lg: 'px-8 py-4 text-lg min-h-16',
    xl: 'px-8 py-6 text-2xl min-h-[5.5rem]',
    '2xl': 'px-8 py-8 text-[1.75rem] min-h-[6.5rem]',
    '3xl': 'px-8 py-10 text-[2rem] min-h-28',
    '4xl': 'px-8 py-12 text-[2rem] min-h-32',
  }

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      {...props}
    />
  )
}
