import { useState } from 'react'
import style from './gallery.module.css'
import { Button } from '../button/button.tsx'
import clsx from 'clsx'
import { ArrowIcon } from '../../components/icons/arrow-icon/arrow-icon.tsx'

interface GalleryProps {
  images: string[]
}

export function Gallery({ images }: GalleryProps) {
  const [imageIndex, setImageIndex] = useState(0)
  const getImage = (offset: number) => {
    const index = (imageIndex + offset) % images.length
    return images[index < 0 ? index + images.length : index]
  }

  function handleLeft() {
    if (!images.length) return
    setImageIndex((prevInx) => (prevInx <= 0 ? images.length - 1 : prevInx - 1))
  }

  function handleRight() {
    if (!images.length) return
    setImageIndex((prevInx) => (prevInx >= images.length - 1 ? 0 : prevInx + 1))
  }

  if (!images.length) return null

  return (
    <div
      className={clsx({
        [style.container]: true,
        [style['single-image']]: images.length < 2,
      })}
    >
      {images.length >= 1 && (
        <div className={style['main-image']}>
          <img src={getImage(0)} className={clsx(style.image, style['current-image'])} alt='' />
          {images.length > 1 && (
            <>
              <Button
                styleClass={`${style['slider-button']} ${style['button-left']}`}
                onClick={handleLeft}
                icon={<ArrowIcon rotateAngle={90} />}
              />
              <Button
                styleClass={`${style['slider-button']} ${style['button-right']}`}
                onClick={handleRight}
                icon={<ArrowIcon rotateAngle={-90} />}
              />
            </>
          )}
        </div>
      )}

      {images.length >= 2 && (
        <div className={style['side-image']}>
          <img src={getImage(1)} className={style.image} alt='' />
        </div>
      )}

      {images.length >= 3 && (
        <div className={style['side-image']}>
          <img src={getImage(2)} className={style.image} alt='' />
        </div>
      )}

      {images.length >= 4 && (
        <div className={style['side-image']}>
          {images.length > 4 && <span className={style.counter}>+{images.length - 4}</span>}
          <div className={style.overlay}></div>
          <img src={getImage(3)} className={style.image} alt='' />
        </div>
      )}
    </div>
  )
}
