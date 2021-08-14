import { signIn, getSession } from 'next-auth/client'
import Head from 'next/head'
import { useState, useRef } from 'react'
import styles from '../styles/Signup.module.css'

export default function Signup() {
  const [errorsList, setErrors] = useState(null)
  const signupFormHook = useRef(null)

  const signUpApiCall = (e) => {
    e.preventDefault()

    const form = signupFormHook.current
    const username = form['username'].value
    const email = form['email'].value
    const password = form['password'].value

    fetch('api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status && data.status === 'error') renderErrors(errors)
        else {
          alert('You have successfully created your account. You can now log in!')
          signIn()
        }
      })
      .catch(console.error)
  }

  const renderErrors = (errors) => {
    errors = errors.filter((x) => x).map((err, index) => <p key={index}>• {err}</p>)

    setErrors(errors)
  }

  const resetForm = () => {
    signupFormHook.current['username'].value = ''
    signupFormHook.current['email'].value = ''
    signupFormHook.current['password'].value = ''
  }

  return (
    <>
      <Head>
        <title>Sign Up</title>
        <meta key='description' name='description' content='Infinity Sign Up Page'></meta>
        <link rel='icon' href='/logo.png' />
      </Head>
      <form className={styles.signUpContainer} ref={signupFormHook}>
        {errorsList && errorsList.length > 0 && (
          <div className={styles.signUpErrorsContainer}>
            <h1>Something went wrong!</h1>
            {errorsList}
          </div>
        )}
        <div className={styles.signUpInputsContainer}>
          <div className={styles.signUpLineDiv + ' fullCenter'}>
            <div className={styles.signUpLabelDiv + ' fullCenter'}>
              <label htmlFor='username'>Username</label>
            </div>
            <div className={styles.signUpInputDiv + ' fullCenter'}>
              <input
                type='text'
                required
                id='username'
                name='username'
                placeholder='chicken_enjoyer_1337'
              ></input>
            </div>
            <div className={styles.signUpShortBorderLine}></div>
          </div>
          <div className={styles.signUpLineDiv + ' fullCenter'}>
            <div className={styles.signUpLabelDiv + ' fullCenter'}>
              <label htmlFor='email'>Email</label>
            </div>
            <div className={styles.signUpInputDiv + ' fullCenter'}>
              <input type='email' required id='email' name='email'></input>
            </div>
            <div className={styles.signUpShortBorderLine}></div>
          </div>
          <div className={styles.signUpLineDiv + ' fullCenter'}>
            <div className={styles.signUpLabelDiv + ' fullCenter'}>
              <label htmlFor='password'>Password</label>
            </div>
            <div className={styles.signUpInputDiv + ' fullCenter'}>
              <input type='password' required id='password' name='password'></input>
            </div>
            <div className={styles.signUpShortBorderLine}></div>
          </div>
        </div>
        <div className={styles.signupButtonsContainer + ' fullCenter'}>
          <button className={styles.signUpPageButton} onClick={signUpApiCall}>
            Sign up
          </button>
          <button className={styles.signUpPageButton} onClick={resetForm}>
            Reset
          </button>
        </div>
      </form>
    </>
  )
}

export async function getServerSideProps({ req }) {
  const session = await getSession({ req })

  if (session)
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }

  return {
    props: {},
  }
}
