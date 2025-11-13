import { type ChangeEvent, type FormEvent, useState } from 'react'
import style from './moderate-form.module.css'
import clsx from 'clsx'
import { closeModal } from '../../services/slices/modalSlice.ts'
import { CloseIcon } from '../icons/close-icon/close-icon.tsx'
import { Button } from '../../widgets/button/button.tsx'
import type { TAdStatus } from '../../types/ads-api.ts'
import { useAppDispatch } from '../../services/store/store.ts'
import { AdsApi } from '../../api/ads-api/ads-api.ts'

interface ModerateFormProps {
  status: TAdStatus
  callback: () => Promise<void>
  adId: string
}

export function ModerateForm({ status, callback, adId }: ModerateFormProps) {
  const isReject = status === 'rejected'
  const dispatch = useAppDispatch()
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    quickReason: 'Другое',
    reason: '',
    comment: '',
  })

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  function validateForm(): boolean {
    if (!form.reason && form.quickReason === 'Другое') {
      setError('Пожалуйста, укажите причину отклонения')
      return false
    }
    return true
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validateForm()) return
    const reason = form.quickReason !== 'Другое' ? form.quickReason : form.reason
    try {
      if (isReject) {
        await AdsApi.rejectAd(parseInt(adId), reason, form.comment)
      } else {
        await AdsApi.requestChanges(parseInt(adId), reason, form.comment)
      }
      await callback()
    } catch (error: any) {
      throw new Error(error.message || 'Ошибка отправки формы')
    } finally {
      dispatch(closeModal())
    }
  }

  return (
    <form onSubmit={handleSubmit} className={style.form}>
      <span className={style.title}>{isReject ? 'Отклонение' : 'На доработку'}</span>

      <select value={form.quickReason} name={'quickReason'} onChange={handleChange}>
        <option value={'Запрещенный товар'}>Запрещенный товар</option>
        <option value={'Неверная категория'}>Неверная категория</option>
        <option value={'Некорректное описание'}>Некорректное описание</option>
        <option value={'Проблемы с фото'}>Проблемы с фото</option>
        <option value={'Подозрение на мошенничество'}>Подозрение на мошенничество</option>
        <option value={'Другое'}>Другое</option>
      </select>

      <input
        type='text'
        name='reason'
        placeholder={'Причина отклонения объявления'}
        className={style.input}
        onChange={handleChange}
        value={form.reason}
        required={form.quickReason === 'Другое'}
      />

      <textarea
        name='comment'
        placeholder={'Комментарий'}
        value={form.comment}
        onChange={handleChange}
        className={clsx(style.input, style.textarea)}
      />

      <Button type='submit' text='Отправить' styleClass={style.submit} disableClass={style['submit-disabled']} />
      {error && <div className={style.error}>{`* ${error}`}</div>}
      {isReject && <Button icon={<CloseIcon />} styleClass={style.close} onClick={() => dispatch(closeModal())} />}
    </form>
  )
}
