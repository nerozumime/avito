import { type ChangeEventHandler } from 'react'
import styles from './input.module.css'
import clsx from 'clsx'
import { CheckboxIcon } from '../icons/checkbox-icon/checkbox-icon.tsx'

interface InputProps {
  checked: boolean
  onChange: ChangeEventHandler<HTMLInputElement>
  name: string
  value: string
  label: string
  type: 'radio' | 'checkbox'
  checkedFill: string
}

export function Input({ checked, onChange, name, value, label, type, checkedFill }: InputProps) {
  return (
    <label className={styles['label-ui']}>
      <input
        name={name}
        type={type}
        checked={checked}
        onChange={onChange}
        className={clsx(styles['input'])}
        tabIndex={-1}
        value={value}
      />
      <CheckboxIcon checked={checked} type={type} styleClass={styles.checkbox} checkedFill={checkedFill} />
      <span className={styles['span-ui']}>{label}</span>
    </label>
  )
}
