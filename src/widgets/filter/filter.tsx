import { AD_STATUS } from '../../constants/constants.ts'
import { Button } from '../button/button.tsx'
import type { IFilter } from '../../types/ads-api.ts'
import type { ChangeEvent, Ref } from 'react'
import { Input } from '../../components/input/input.tsx'

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
    <div>
      <span>Фильтры</span>
      {/*Секция фильтров статуса*/}
      <section>
        <fieldset>
          <legend>Статусы:</legend>
          <Input
            type='checkbox'
            name='status'
            value='pending'
            onChange={handleStatusChange}
            checked={filters.status.includes('pending')}
            label={AD_STATUS.pending.label}
          />
          <Input
            type='checkbox'
            name='status'
            value='approved'
            onChange={handleStatusChange}
            checked={filters.status.includes('approved')}
            label={AD_STATUS.approved.label}
          />
          <Input
            type='checkbox'
            name='status'
            value='rejected'
            onChange={handleStatusChange}
            checked={filters.status.includes('rejected')}
            label={AD_STATUS.rejected.label}
          />
        </fieldset>
      </section>
      {/*Секция фильтров категории*/}
      <div>
        <label htmlFor='category-select'>Выбор категории:</label>
        <select
          id={'category-select'}
          onChange={handleFilterChange}
          name={'categoryId'}
          value={filters.categoryId ?? ''}
        >
          <option value=''>Не выбрано</option>
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
        <fieldset>
          <label>
            Мин. цена
            <input type={'number'} name={'minPrice'} value={filters.minPrice ?? ''} onChange={handleFilterChange} />
          </label>
          <label>
            Макс. цена
            <input type={'number'} name={'maxPrice'} value={filters.maxPrice ?? ''} onChange={handleFilterChange} />
          </label>
        </fieldset>
      </section>
      {/* Секция фильтра по названию */}
      <section>
        <label>
          Название
          <input name={'search'} type={'text'} value={filters.search} onChange={handleFilterChange} ref={searchRef} />
        </label>
      </section>
      {/* Секция сортировки */}
      <section>
        <span>Сортировать</span>
        <select onChange={handleSort} name={'sortBy'} value={`${filters.sortBy} ${filters.sortOrder}`}>
          <option value={'createdAt desc'}>По дате создания (сначала новые)</option>
          <option value={'price desc'}>По цене (по убыванию)</option>
          <option value={'priority desc'}>По приоритету (сначала приоритетные)</option>
          <option value={'createdAt asc'}>По дате создания (сначала старые)</option>
          <option value={'price asc'}>По цене (по возрастанию)</option>
          <option value={'priority asc'}>По приоритету (сначала обычные)</option>
        </select>
      </section>
      <Button onClick={handleResetFilters} text={'Сбросить фильтры'} />
    </div>
  )
}
