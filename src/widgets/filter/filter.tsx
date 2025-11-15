import { AD_STATUS, STATUS_COLOR_MAP } from '../../constants/constants.ts'
import { Button } from '../button/button.tsx'
import type { IFilter } from '../../types/ads-api.ts'
import type { ChangeEvent, Ref } from 'react'
import { Input } from '../../components/input/input.tsx'
import style from './filter.module.css'

interface FilterProps {
  filters: IFilter
  handleStatusChange: (e: ChangeEvent<HTMLInputElement>) => void
  handleFilterChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  searchRef: Ref<HTMLInputElement>
  handleSort: (e: ChangeEvent<HTMLSelectElement>) => void
  handleResetFilters: () => void
}

export function Filter({
  filters,
  handleStatusChange,
  handleFilterChange,
  searchRef,
  handleSort,
  handleResetFilters,
}: FilterProps) {
  return (
    <div className={style.filter}>
      <div className={style.header}>
        <span className={style.title}>Фильтры:</span>
        <Button onClick={handleResetFilters} text={'Сбросить фильтры'} styleClass={style.reset} />
      </div>
      {/*Секция фильтров статуса*/}
      <section>
        <fieldset className={style.statuses}>
          <legend>Статусы:</legend>
          <Input
            type='checkbox'
            name='status'
            value='pending'
            onChange={handleStatusChange}
            checked={filters.status.includes('pending')}
            label={AD_STATUS.pending.label}
            checkedFill={STATUS_COLOR_MAP.requestChanges.backgroundColor}
          />
          <Input
            type='checkbox'
            name='status'
            value='approved'
            onChange={handleStatusChange}
            checked={filters.status.includes('approved')}
            label={AD_STATUS.approved.label}
            checkedFill={STATUS_COLOR_MAP.approved.backgroundColor}
          />
          <Input
            type='checkbox'
            name='status'
            value='rejected'
            onChange={handleStatusChange}
            checked={filters.status.includes('rejected')}
            label={AD_STATUS.rejected.label}
            checkedFill={STATUS_COLOR_MAP.rejected.backgroundColor}
          />
        </fieldset>
      </section>
      {/*Секция фильтров категории*/}
      <div>
        <label htmlFor='category-select' className={style.label}>
          Выбор категории:
        </label>
        <select
          id={'category-select'}
          onChange={handleFilterChange}
          name={'categoryId'}
          value={filters.categoryId ?? ''}
          className={style.input}
        >
          <option value=''>Любая категория</option>
          <option value={0}>Электроника</option>
          <option value={1}>Недвижимость</option>
          <option value={2}>Транспорт</option>
          <option value={3}>Работа</option>
          <option value={4}>Услуги</option>
          <option value={5}>Животные</option>
          <option value={6}>Мода</option>
          <option value={7}>Детское</option>
        </select>
      </div>
      {/* Секция фильтров по цене */}
      <section>
        <fieldset className={style.prices}>
          <div>
            <label className={style.label} htmlFor={'min-price'}>
              Мин. цена
            </label>
            <input
              id={'min-price'}
              type={'number'}
              name={'minPrice'}
              value={filters.minPrice ?? ''}
              onChange={handleFilterChange}
              className={style.input}
              placeholder={'От ₽'}
            />
          </div>
          <div>
            <label className={style.label} htmlFor={'max-price'}>
              Макс. цена
            </label>
            <input
              id={'max-price'}
              type={'number'}
              name={'maxPrice'}
              value={filters.maxPrice ?? ''}
              onChange={handleFilterChange}
              className={style.input}
              placeholder={'До ₽'}
            />
          </div>
        </fieldset>
      </section>
      {/* Секция фильтра по названию */}
      <section>
        <label className={style.label} htmlFor={'search'}>
          Название
        </label>
        <input
          id={'search'}
          name={'search'}
          type={'text'}
          value={filters.search}
          onChange={handleFilterChange}
          ref={searchRef}
          className={style.input}
          placeholder={'Название объявления'}
        />
      </section>
      {/* Секция сортировки */}
      <section>
        <label htmlFor={'select-sort'} className={style.label}>
          Сортировать
        </label>
        <select
          id={'select-sort'}
          onChange={handleSort}
          name={'sortBy'}
          value={`${filters.sortBy} ${filters.sortOrder}`}
          className={style.input}
        >
          <option value={'createdAt desc'}>По дате создания (сначала новые)</option>
          <option value={'price desc'}>По цене (по убыванию)</option>
          <option value={'priority desc'}>По приоритету (сначала приоритетные)</option>
          <option value={'createdAt asc'}>По дате создания (сначала старые)</option>
          <option value={'price asc'}>По цене (по возрастанию)</option>
          <option value={'priority asc'}>По приоритету (сначала обычные)</option>
        </select>
      </section>
    </div>
  )
}
