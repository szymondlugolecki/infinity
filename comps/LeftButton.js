import Link from 'next/link'
import styles from '../styles/LeftButton.module.css'

export default function LeftButton({ name, route, disabled }) {
  const hyperlinkClass = disabled
    ? `${styles.leftButtonHyperlink} ${styles.leftButtonHLDisabled}`
    : styles.leftButtonHyperlink

  return (
    <div className={disabled ? styles.leftDisabledButton : styles.leftButton}>
      {disabled && (
        <a className={hyperlinkClass}>
          <span
            width='30px'
            height='30px'
            className={styles.leftButtonImg + ' ' + styles[`${name.toLowerCase()}ButtonImg`]}
          ></span>
          <span className={styles.leftButtonText}>{name}</span>
        </a>
      )}
      {!disabled && (
        <Link href={route}>
          <a className={hyperlinkClass}>
            <span
              width='30px'
              height='30px'
              className={styles.leftButtonImg + ' ' + styles[`${name.toLowerCase()}ButtonImg`]}
            ></span>
            <span className={styles.leftButtonText}>{name}</span>
          </a>
        </Link>
      )}
    </div>
  )
}
