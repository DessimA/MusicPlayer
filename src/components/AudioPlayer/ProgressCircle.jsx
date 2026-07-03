import { useId } from 'react'
import styles from './AudioPlayer.module.css'

const RADIUS_OFFSET = 10
const INNER_CIRCLE_OFFSET = 30
const INNERMOST_CIRCLE_OFFSET = 100

function Circle({ color, percentage, size, strokeWidth }) {
  const radius = size / 2 - RADIUS_OFFSET
  const circumference = 2 * Math.PI * radius - 20
  const strokeOffset = ((100 - Math.round(percentage)) * circumference) / 100

  return (
    <circle
      r={radius}
      cx="50%"
      cy="50%"
      fill="transparent"
      stroke={strokeOffset !== circumference ? color : ''}
      strokeWidth={strokeWidth}
      strokeDasharray={circumference}
      strokeDashoffset={percentage ? strokeOffset : 0}
      strokeLinecap="round"
    />
  )
}

export default function ProgressCircle({
  percentage,
  isPlaying,
  size,
  color,
  image,
}) {
  const clipPathId = useId()
  const innerClipPathId = useId()

  return (
    <div className={styles.progressCircle}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        <g>
          <Circle strokeWidth="0.4rem" color="#1ed760" size={size} />
          <Circle
            strokeWidth="0.6rem"
            color={color}
            percentage={percentage}
            size={size}
          />
        </g>
        <defs>
          <clipPath id={clipPathId}>
            <circle cx="50%" cy="50%" r={size / 2 - INNER_CIRCLE_OFFSET} />
          </clipPath>
          <clipPath id={innerClipPathId}>
            <circle cx="50%" cy="50%" r={size / 2 - INNERMOST_CIRCLE_OFFSET} />
          </clipPath>
        </defs>
        <image
          className={isPlaying ? styles.active : ''}
          x={INNER_CIRCLE_OFFSET}
          y={INNER_CIRCLE_OFFSET}
          width={2 * (size / 2 - INNER_CIRCLE_OFFSET)}
          height={2 * (size / 2 - INNER_CIRCLE_OFFSET)}
          href="https://static.vecteezy.com/system/resources/previews/007/619/838/original/vinyl-disc-record-for-music-album-cover-design-vector.jpg"
          clipPath={`url(#${clipPathId})`}
        />
        <image
          className={isPlaying ? styles.active : ''}
          x={INNERMOST_CIRCLE_OFFSET}
          y={INNERMOST_CIRCLE_OFFSET}
          width={2 * (size / 2 - INNERMOST_CIRCLE_OFFSET)}
          height={2 * (size / 2 - INNERMOST_CIRCLE_OFFSET)}
          href={image}
          clipPath={`url(#${innerClipPathId})`}
        />
      </svg>
    </div>
  )
}
