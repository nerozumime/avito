import style from './no-data.module.css'

export function NoData() {
  return <div className={style['no-data']}>Данных за этот период нет.</div>
}
