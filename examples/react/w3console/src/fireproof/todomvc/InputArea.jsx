import React from 'react'
import { useInput } from './useInput'

export default function InputArea ({ onSubmit, placeholder, autoFocus = true }) {
  const { setValue, resetValue, ...inputProps } = useInput('', { controlled: true })
  if (autoFocus) {
    inputProps.autoFocus = true
  }
  const handleNewTodoKeyDown = (event) => {
    if (event.keyCode !== 13) return
    event.preventDefault()
    const val = event.target.value.trim()
    if (val) {
      onSubmit(val)
      setValue('')
    }
  }
  return (
    <input
      class="p-2 my-3 ml-6 w-3/4 bg-slate-300 text-black rounded" placeholder={placeholder}
      onKeyDown={handleNewTodoKeyDown} {...inputProps}
    />
  )
}
