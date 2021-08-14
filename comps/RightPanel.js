import Link from 'next/link'

import styles from '../styles/RightPanel.module.css'

export default function RightPanel({ fixedTrends }) {
  const trends = JSON.parse(fixedTrends)

  return (
    <div className={styles.rightPanel}>
      <div className={styles.recentPosts}>
        {trends && trends.length > 0 && (
          <div className={styles.trendsForYou}>
            <span>Trends for you</span>
          </div>
        )}
        {trends &&
          trends.length > 0 &&
          trends.map(({ name, count }, index) => {
            const postsSpan = count == 1 ? `${count} post` : `${count} posts`
            return (
              <Link href={`/trend/${name}`} key={index}>
                <a className={styles.trendContainer} key={index}>
                  <span className={styles.trendNameSpan}>#{name}</span>
                  <span className={styles.trendBreakBullet}>•</span>
                  <span className={styles.trendCountSpan}>{postsSpan}</span>
                </a>
              </Link>
            )
          })}
        {!trends ||
          (trends.length === 0 && (
            <div className={styles.noTrendsFound}>
              <span>No trends founds 😥</span>
            </div>
          ))}
      </div>
      <div className={styles.legalStuff}>
        <Link href='/tos'>
          <a>ToS</a>
        </Link>
        <span>•</span>
        <Link href='/privacy'>
          <a>Privacy</a>
        </Link>
        <span>•</span>
        <Link href='/attributions'>
          <a>Attributions</a>
        </Link>
      </div>
    </div>
  )
}
