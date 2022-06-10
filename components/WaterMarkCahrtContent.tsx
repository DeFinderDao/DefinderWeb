interface WaterMarkCahrtContentProps {
  right?: number,
  top?: number
}
export default function WaterMarkCahrtContent({ right = 60, top = 250 }: WaterMarkCahrtContentProps) {
  return (
    <img
      style={{
        position: 'absolute',
        right: right,
        top: top,
        width: '123px',
        opacity: 0.3,
        pointerEvents: 'none'
      }}
      src="/images/line-watermark-info.svg"
    />
  )
}