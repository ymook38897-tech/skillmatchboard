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
  const baseStyles =
    'inline-flex items-center justify-center rounded-xl font-bold leading-none transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-45 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-600 focus-visible:ring-offset-4 focus-visible:ring-offset-[#FAF8F2]'

  const variants = {
    primary:
      'border-2 border-primary-600 bg-primary-600 text-white hover:bg-primary-700',
    secondary:
      'border-2 border-primary-600 bg-primary-100 text-[#0D0C0C] hover:bg-primary-200',
    outline:
      'border-2 border-[#4D4B46] bg-[#FAF8F2] text-[#0D0C0C] hover:bg-white',
  }

  const sizes = {
    sm: 'min-h-14 px-5 py-3 text-xl',
    md: 'min-h-14 px-6 py-3 text-xl',
    lg: 'min-h-16 px-7 py-4 text-2xl',
    xl: 'min-h-24 px-8 py-6 text-[2rem]',
    '2xl': 'min-h-24 px-8 py-7 text-[2rem]',
    '3xl': 'min-h-28 px-8 py-8 text-[2rem]',
    '4xl': 'min-h-24 px-8 py-8 text-[2rem]',
  }

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      {...props}
    />
  )
}
