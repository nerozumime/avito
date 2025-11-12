import { useParams } from 'react-router-dom'

export function DetailedAdItem() {
  const { id } = useParams()
  return <div>Объявление {id}</div>
}
