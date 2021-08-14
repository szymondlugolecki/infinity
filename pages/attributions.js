import Head from 'next/head'
import Link from 'next/link'

import styles from '../styles/Attributions.module.css'

export default function Attributions() {
  return (
    <>
      <Head>
        <title>Attributions</title>
        <meta key='description' name='description' content='Infinity Page Attributions'></meta>
        <link rel='icon' href='/logo.png' />
      </Head>
      <div className={styles.attributionList}>
        <div className={styles.attibution}>
          Icons made by{' '}
          <a href='https://www.flaticon.com/authors/dave-gandy' title='Dave Gandy'>
            Dave Gandy
          </a>{' '}
          from{' '}
          <a href='https://www.flaticon.com/' title='Flaticon'>
            www.flaticon.com
          </a>
        </div>
        <div className={styles.attibution}>
          Icons made by{' '}
          <a href='https://www.flaticon.com/authors/pixel-perfect' title='Pixel perfect'>
            Pixel perfect
          </a>{' '}
          from{' '}
          <a href='https://www.flaticon.com/' title='Flaticon'>
            www.flaticon.com
          </a>
        </div>
        <div className={styles.attibution}>
          Icons made by{' '}
          <a href='https://www.freepik.com' title='Freepik'>
            Freepik
          </a>{' '}
          from{' '}
          <a href='https://www.flaticon.com/' title='Flaticon'>
            www.flaticon.com
          </a>
        </div>
        <div className={styles.attibution}>
          Icons made by{' '}
          <a href='https://www.flaticon.com/authors/kiranshastry' title='Kiranshastry'>
            Kiranshastry
          </a>{' '}
          from{' '}
          <a href='https://www.flaticon.com/' title='Flaticon'>
            www.flaticon.com
          </a>
        </div>
        <div className={styles.attibution}>
          Icons made by{' '}
          <a href='https://www.flaticon.com/authors/bqlqn' title='bqlqn'>
            bqlqn
          </a>{' '}
          from{' '}
          <a href='https://www.flaticon.com/' title='Flaticon'>
            www.flaticon.com
          </a>
        </div>

        <Link href='/'>
          <a className={styles.goBackHyperlink}>Return to main page</a>
        </Link>
      </div>
    </>
  )
}
