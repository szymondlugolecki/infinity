import LeftButton from '../comps/LeftButton'
import Link from 'next/link'
import { signIn, signOut } from 'next-auth/client'
import styles from '../styles/LeftPanel.module.css'

export default function LeftPanel({ session }) {
  return (
    <div className={styles.leftPanel}>
      <div className={styles.leftButtonCollection}>
        <LeftButton name='Home' route='/' />
        <LeftButton
          name='Profile'
          route={session ? `/profile/${session.user.username}` : null}
          disabled={session ? false : true}
        />
        <LeftButton name='Settings' route={session ? `/settings` : null} disabled={session ? false : true} />
      </div>
      {!session && (
        <div className={styles.authButtons}>
          <button className='authButton' onClick={signIn}>
            Log In
          </button>
          <Link href={`${process.env.baseUrl}/signup`}>
            <button className='authButton'>Sign Up</button>
          </Link>
        </div>
      )}
      {session && (
        <div className={styles.authButtons}>
          <Link href={`/profile/${session.user.username}`}>
            <button className='authButton'>Profile</button>
          </Link>
          <button className='authButton' onClick={signOut}>
            Log Out
          </button>
        </div>
      )}
    </div>
  )
}
