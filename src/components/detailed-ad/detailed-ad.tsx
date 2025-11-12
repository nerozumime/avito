import { useParams } from 'react-router-dom'

export function DetailedAd() {
  const { id } = useParams()
  return <div>Объявление {id}</div>
}
