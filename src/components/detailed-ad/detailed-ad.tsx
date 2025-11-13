import { useLocation, useParams } from 'react-router-dom'
import { useNavigate } from 'react-router'
import { Gallery } from '../../widgets/gallery/gallery.tsx'

export function DetailedAd() {
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from || '/list'

  const { id } = useParams()
  function handleReturnToList() {
    navigate(from)
  }
  return (
    <div>
      <Gallery
        images={['/public/image-placeholder.jpeg', '/public/image-placeholder.jpeg', '/public/image-placeholder.jpeg']}
      />
      <div>Объявление {id}</div>
      <button onClick={handleReturnToList}>К списку</button>
    </div>
  )
}
