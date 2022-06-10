interface WaterMarkContentProps {
  position?: "-moz-initial" | "inherit" | "initial" | "revert" | "unset" | "-webkit-sticky" | "absolute" | "fixed" | "relative" | "static" | "sticky",
  right?: number,
  bottom?: number
}
export default function WaterMarkContent({ position = 'absolute', right = 100, bottom = 100 }: WaterMarkContentProps) {
  return (
    <img
      style={{
        position: position,
        right: right,
        bottom: bottom,
        zIndex: 998,
        width: 123,
        opacity: 0.3,
        pointerEvents: 'none'
      }}
      src="/images/line-watermark-info.svg"
    />
  )
}