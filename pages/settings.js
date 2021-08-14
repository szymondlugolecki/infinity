import { getSession } from 'next-auth/client'
import Head from 'next/head'
import React, { useState, useRef } from 'react'
import InfinityButton from '../comps/InfinityButton'
import User from '../models/User'
import LeftPanel from '../comps/LeftPanel'

import styles from '../styles/Settings.module.css'

const now = () => Date.now()

export default function Settings({ session, avatar, bio }) {
  const [userAvatar, setUserAvatar] = useState(avatar)
  const [firstTime, setFirstTime] = useState(true)
  const [image, setImage] = useState(null)
  const [textValue, setTextValue] = useState('')
  const [rows, setRows] = useState(3)
  const [autosaver, setAutosaver] = useState([])
  const [lastChange, setLastChange] = useState(null)
  const [createObjectURL, setCreateObjectURL] = useState(null)

  const bioHook = useRef(null)

  if (!textValue && bio && firstTime) {
    setTextValue(bio)
    setFirstTime(false)
  }

  function handleChange({ target }) {
    setLastChange(now())

    const textareaLineHeight = 24
    const [minRows, maxRows] = [4, 6]

    const previousRows = target.rows
    target.rows = minRows

    const currentRows = ~~(target.scrollHeight / textareaLineHeight)

    if (currentRows === previousRows) target.rows = currentRows

    if (currentRows >= maxRows) {
      target.rows = maxRows
      target.scrollTop = target.scrollHeight
    }

    setRows(currentRows < maxRows ? currentRows : maxRows)
    setTextValue(target.value)

    if (autosaver.length === 0) setAutosaver([...autosaver, setTimeout(async () => await updateBio(), 3000)])
    else {
      if ((now() - lastChange) / 1000 < 3) {
        autosaver.forEach((to) => {
          clearTimeout(to)
          setAutosaver([])
        })
        setAutosaver([...autosaver, setTimeout(async () => await updateBio(), 3000)])
      }
    }
  }

  async function updateBio() {
    const bio = bioHook.current.value
    try {
      const data = await fetch('api/user/bio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bio }),
      })

      const response = await data.json()
      return response
    } catch (error) {
      console.error(error)
      throw new Error(error)
    }
  }

  function readFile({ target }) {
    if (target.files && target.files[0]) {
      const i = target.files[0]
      setImage(i)
      setCreateObjectURL(URL.createObjectURL(i))
      if (i.size * 0.000001 > 2) {
        alert('This file is too big (>2MB)')
        removeFile()
      }
    }
  }

  function removeFile() {
    setImage(null)
    setCreateObjectURL(null)
  }

  function uploadFile() {
    if (image.size * 0.000001 > 2) {
      alert('This file is too big (>2MB)')
      removeFile()
      return
    }

    const reader = new FileReader()

    reader.onload = async () => {
      const data = await fetch('/api/user/avatar', {
        method: 'POST',
        body: reader.result,
      })

      const response = await data.json()
      if (response && response.image) {
        setUserAvatar(response.image)
        setImage(null)
      }
    }
    reader.onerror = () => {
      alert('An error occured while trying to upload the image. Try again later')
    }

    reader.readAsDataURL(image)
  }

  const avatarReady = (
    <>
      <div className={styles.imageCD}>
        <label htmlFor='avatar'>
          <img src={userAvatar} alt={'your profile picture'}></img>
        </label>
        <input type='file' id='avatar' name='avatar' accept='image/png, image/jpeg' onChange={readFile} />
      </div>
    </>
  )

  return (
    <>
      <Head>
        <title>Settings</title>
        <meta key='description' name='description' content='Infinity User Settings Page'></meta>
        <link rel='icon' href='/logo.png' />
      </Head>
      <LeftPanel session={session} />
      <div className={styles.settingsContainer}>
        <div className={styles.bioBar + ' fullCenter'} id={styles.bioContainer}>
          <div className={styles.settingNameContainer + ' fullCenter'}>
            <span>Bio</span>
          </div>
          <div className={styles.settingItselfContainer + ' fullCenter'}>
            <textarea
              rows={rows}
              value={textValue}
              maxLength={234}
              placeholder={'Describe yourself briefly'}
              onChange={handleChange}
              ref={bioHook}
            />
          </div>
        </div>
        <div className={styles.settingBar + ' fullCenter'} id={styles.avatarContainer}>
          <div className={styles.settingNameContainer + ' fullCenter'}>
            <span>Avatar</span>
          </div>
          <div className={styles.settingItselfContainer + ' fullCenter'}>
            {!image && avatarReady}
            {image && (
              <div className={styles.imageCD}>
                <img src={createObjectURL} width='70px' height='70px' alt={'avatar you just uploaded'}></img>
                <InfinityButton onClick={uploadFile} text='Upload' />
                <InfinityButton onClick={removeFile} text='Remove' />
              </div>
            )}
          </div>
        </div>
      </div>
      <div className={styles.settingsRightsideBalanceDiv}></div>
    </>
  )
}

export async function getServerSideProps({ req }) {
  const session = await getSession({ req })
  if (!session) {
    return {
      redirect: {
        destination: '/api/auth/signin',
        permanent: false,
      },
    }
  }
  const user = await User.findOne({ _id: session.user.id })
  return {
    props: { session, avatar: user.avatar, bio: user.bio },
  }
}
