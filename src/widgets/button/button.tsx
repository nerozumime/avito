import styles from './button.module.css'
import clsx from 'clsx'
import { type ReactElement } from 'react'

interface ButtonProps {
  text?: string
  onClick?: () => void
  styleClass?: string
  disableClass?: string
  textClass?: string
  gap?: number
  type?: 'submit' | 'button' | 'reset'
  icon?: ReactElement
  iconPosition?: 'left' | 'right'
  disabled?: boolean
  title?: string
  ariaLabel?: string
}

export function Button({
  text = '',
  onClick,
  styleClass,
  disableClass,
  textClass,
  icon,
  type = 'button',
  gap = 0,
  iconPosition = 'right',
  disabled = false,
  title = '',
  ariaLabel = '',
}: ButtonProps) {
  const handleClick = () => {
    if (!disabled) {
      onClick?.()
    }
  }

  return (
    <button
      className={clsx(styles.button, !disabled ? styleClass : disableClass)}
      onClick={handleClick}
      disabled={disabled}
      type={type}
      title={title}
      aria-label={ariaLabel}
    >
      <div
        className={clsx(icon && styles.flex, iconPosition === 'left' && styles['flex-reverse'])}
        style={{ gap: `${gap}px` }}
      >
        <span className={textClass}>{text}</span>
        {icon && icon}
      </div>
    </button>
  )
}
