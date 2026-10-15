import { QRCodeSVG } from 'qrcode.react'

interface QRCodeDisplayProps {
  value: string
  size?: number
}

export default function QRCodeDisplay({ value, size = 200 }: QRCodeDisplayProps) {
  return (
    <div className="inline-block p-4 bg-white rounded-2xl border border-gray-200">
      <QRCodeSVG
        value={value}
        size={size}
        level="M"
        bgColor="#ffffff"
        fgColor="#111827"
        marginSize={0}
      />
    </div>
  )
}