import ayuLogo from '../assets/ayu-logo.png'

interface LogoProps {
  size?: 'small' | 'medium' | 'large'
  showImage?: boolean
}

function Logo({
  size = 'medium',
  showImage = false,
}: LogoProps) {
  return (
    <div className={`ayu-brand ayu-brand-${size}`}>
      {showImage ? (
        <img
          src={ayuLogo}
          alt="AYU"
          className="ayu-brand-image"
        />
      ) : (
        <span className="brand-mark">✦</span>
      )}

      <span className="ayu-brand-name">AYU</span>
    </div>
  )
}

export default Logo