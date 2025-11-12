import type { IAd } from '../../types/api.ts'

interface PreviewAdProps {
  ad: IAd
}

export function PreviewAd({ ad }: PreviewAdProps) {
  return <div>{ad.title}</div>
}
