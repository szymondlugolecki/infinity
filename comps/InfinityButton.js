import styles from '../styles/InfinityButton.module.css'

export default function InfinityButton({ text, onClick }) {
  return (
    <button className={styles.infinityButton} onClick={onClick}>
      {text}
    </button>
  )
}
