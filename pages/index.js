import Head from 'next/head'
import Link from 'next/link'
import React, { useState } from 'react'
import styles from '../styles/Home.module.css'
import { signIn, getSession } from 'next-auth/client'
import User from '../models/User'
import PostComponent from '../comps/Post'
import Post from '../models/Post'
import LeftPanel from '../comps/LeftPanel'
import RightPanel from '../comps/RightPanel'
import { useRouter } from 'next/router'
import dbConnect from '../lib/mongodb'
import Comment from '../models/Comment'
import Trend from '../models/Trend'

export default function Home({ me, session, fixedPosts, fixedTrends }) {
  const [rows, setRows] = useState(3)
  const [textValue, setTextValue] = useState('')
  const [image, setImage] = useState(null)
  const [createObjectURL, setCreateObjectURL] = useState(null)
  const [ready, setReady] = useState(false)
  const [posts, setPosts] = useState(fixedPosts ? JSON.parse(fixedPosts) : [])

  const router = useRouter()

  //const [skipPosts, setSkipPosts] = useState(20)

  /*function getPosts() {
    get('api/getPosts', { byProfile: false, skip: skipPosts })
      .then((response) => response.json())
      .then((data) => {
        if (data.status == 'success') {
          setSkipPosts(skipPosts + 20)
          setPosts(posts.concat(data.posts))
        } else alert('Oops! Something went wrong...')
      })
      .catch(console.error)
  }*/

  const createPost = (e) => {
    if (!textValue) return alert('Provide some text')

    if (!image || (image && ready)) {
      fetch('api/post/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: textValue, attachment: ready ? ready : null }),
      })
        .then((response) => response.json())
        .then((data) => {
          if ((data.status = 'success')) {
            removeFile()
            setTextValue('')
            router.reload(window.location.pathname)
          }
        })
        .catch(console.error)
    }
  }

  function handleChange({ target }) {
    const textareaLineHeight = 24
    const [minRows, maxRows] = [3, 10]

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
  }

  function removeFile() {
    setReady(false)
    setCreateObjectURL(null)
    setImage(null)
  }

  function attachmentChange({ target }) {
    if (!target.files && !target.files[0]) return
    const i = target.files[0]
    if (i.size * 0.000001 > 2) {
      alert('This file is too big (>2MB)')
      removeFile()
      return
    }

    setImage(i)
    setCreateObjectURL(URL.createObjectURL(i))

    const reader = new FileReader()

    reader.onload = async () => setReady(reader.result)
    reader.onerror = () => alert('An error occured while trying to upload the image. Try again later')

    reader.readAsDataURL(i)
  }

  return (
    <div className='container'>
      <Head>
        <title>Infinity</title>
        <meta key='description' name='description' content='Infinity Home Page'></meta>
        <link rel='icon' href='/logo.png' />
      </Head>
      <LeftPanel session={session} />
      <div className={styles.mainContent}>
        {session && (
          <div className={styles.createPost}>
            <div className={styles.avatarContainer}>
              <Link href={`/profile/${me.username}`}>
                <a>
                  <img src={me.avatar} alt={'your profile picture'} width='70px' height='70px'></img>
                </a>
              </Link>
            </div>
            <div className={styles.postArea}>
              <textarea
                maxLength={440}
                minLength={3}
                placeholder={"What's on your mind today?"}
                required
                className={styles.postTextbox}
                onChange={handleChange}
                value={textValue ? textValue : ''}
                rows={rows}
              ></textarea>
              <div className={styles.bottomPostArea + ' ' + styles.spaceAround}>
                {createObjectURL && (
                  <div className={styles.attachmentContainer}>
                    <span onClick={removeFile}>
                      <img
                        src={createObjectURL}
                        width='100px'
                        height='100px'
                        alt='image you just uploaded'
                      ></img>
                    </span>
                  </div>
                )}
                {!createObjectURL && (
                  <div className={styles.attachmentsArea}>
                    <div className={styles.attachmentsNav}>
                      <input
                        type='file'
                        id='attachment'
                        name='attachment'
                        className={styles.attachmentInput}
                        accept='image/png, image/jpeg, image/gif'
                        onChange={attachmentChange}
                      />
                      <label className={styles.attachmentLabel} htmlFor='attachment'>
                        <img
                          src='/image_icon.svg'
                          alt='upload an image'
                          width='28px'
                          height='28px'
                          className={styles.attachmentIcon}
                        ></img>
                      </label>
                    </div>
                  </div>
                )}

                <div className={styles.postButtonContainer + ' fullCenter'}>
                  {textValue && (
                    <button onClick={createPost} className={styles.postButton}>
                      Post
                    </button>
                  )}
                  {!textValue && (
                    <button className={styles.disabledPostButton} disabled={true}>
                      Post
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        {!session && (
          <div className={styles.loginToPost + ' fullCenter'}>
            <span>
              <button className='authButton' onClick={signIn}>
                Log In
              </button>{' '}
              to create posts
            </span>
          </div>
        )}
        <section className={styles.homePagePosts}>
          {posts.map((post, index) => (
            <PostComponent key={index} post={post} userId={session ? me.id : null} />
          ))}
        </section>
      </div>
      <RightPanel fixedTrends={fixedTrends} />
    </div>
  )
}

export async function getServerSideProps({ req }) {
  const session = await getSession({ req })

  await dbConnect()

  // fetch 20 (for performance) latest posts

  const peoplePosts = await Post.find({}).sort({ createdTs: -1 }).limit(20)

  const fixedPostsArray = []

  // minify & unfreeze peoplePosts by assigning needed variables to another array - fixedPostsArray

  for await (const { content, createdTs, authorId, likes, attachments, hashtags, _id } of peoplePosts) {
    const postAuthor = await User.findOne({ _id: authorId })
    const comments = await Comment.countDocuments({ postId: _id })

    fixedPostsArray.push({
      id: _id,
      content,
      createdTs,
      likes,
      attachments,
      hashtags,
      commentsCount: comments,
      author: {
        id: authorId,
        username: postAuthor.username,
        avatar: postAuthor.avatar,
      },
    })
  }

  // me object could be useful in future development

  const me = {}

  if (session) {
    const result = await User.findOne({ _id: session.user.id })
    me.avatar = result.avatar
    me.username = result.username
    me.id = result._id
  }

  const trends = await Trend.find({}).sort({ count: -1 }).limit(5)

  // fixedTrends - minified & unfrozen trends

  const fixedTrends = []

  trends.forEach(({ name, count }) => {
    fixedTrends.push({ name, count })
  })

  return {
    props: {
      me,
      session: session ? session : null,
      fixedPosts: JSON.stringify(fixedPostsArray),
      fixedTrends: JSON.stringify(fixedTrends),
    },
  }
}
