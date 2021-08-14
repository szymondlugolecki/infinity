import { useState } from 'react'
import Head from 'next/head'
import { getSession } from 'next-auth/client'
import styles from '../../styles/FullSizePost.module.css'
import LeftPanel from '../../comps/LeftPanel'
import Post from '../../models/Post'
import User from '../../models/User'
import Comment from '../../models/Comment'
import dbConnect from '../../lib/mongodb'
import { useRouter } from 'next/router'
import CommentComponent from '../../comps/Comment'
import PostComponent from '../../comps/Post'
import RightPanel from '../../comps/RightPanel'
import Trend from '../../models/Trend'

export default function FullSizePost({ me, session, fixedPost, userId, fixedTrends }) {
  const fPost = JSON.parse(fixedPost)
  const expr = userId && fPost.likes.includes(userId)
  const [love, setLoved] = useState(expr ? true : false)
  const [lovers, setLovers] = useState(fPost.likes.length)
  const [rows, setRows] = useState(3)
  const [textValue, setTextValue] = useState('')
  const [comments, setComments] = useState(fPost.comments ? fPost.comments : [])

  const router = useRouter()

  const createComment = (e) => {
    e.preventDefault()
    const sendThis = {
      content: textValue,
      postId: fPost.id,
      authorUsername: fPost.author.username,
    }
    fetch('/api/comment/create', {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sendThis),
    })
      .then((response) => response.json())
      .then(console.log)
      .catch(console.log)
      .finally(() => router.reload(window.location.pathname))
  }

  const handleChange = ({ target }) => {
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
  }

  return (
    <>
      <Head>
        <title>
          {fPost.author.username} posted: {fPost.content}
        </title>
        <meta
          key='description'
          name='description'
          content={`Infinity Full-Sized Post\n${fPost.author.username} posted ${fPost.content}`}
        ></meta>
        <link rel='icon' href='/logo.png' />
      </Head>
      <LeftPanel session={session} />
      <div className={styles.postFullSizeContainer}>
        <PostComponent post={fPost} userId={me.id} />

        {session && (
          <div className={styles.postMyComment}>
            <div className={styles.postMyCommentLeftSide + ' fullCenter'}>
              <img src={me.avatar} alt={`your profile picture`} width='50px' height='50px'></img>
            </div>
            <form className={styles.postMyCommentRightSide}>
              <textarea
                rows={rows}
                value={textValue}
                maxLength={234}
                placeholder={'Reply to this post'}
                onChange={handleChange}
              />
              <button className={styles.postButton} onClick={createComment}>
                Post
              </button>
            </form>
          </div>
        )}
        <div className={styles.commentsAreBelow + ' fullCenter'}>
          <span>Replies to this post ↓</span>
        </div>
        {comments.map((comment, index) => {
          return <CommentComponent comment={comment} key={index} userId={session ? userId : null} />
        })}
      </div>
      <RightPanel fixedTrends={fixedTrends} />
    </>
  )
}

export async function getServerSideProps({ req, params: { postid } }) {
  // full-sized post

  const session = await getSession({ req })

  await dbConnect()

  // check if the post exists

  const post = await Post.findOne({ _id: postid })
  if (JSON.stringify(post) == 'null')
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }

  const postAuthor = await User.findOne({ _id: post.authorId })
  const postComments = await Comment.find({ postId: postid })

  const { content, createdTs, likes, attachments, hashtags } = post

  const fixedComments = []

  // minify & unfreeze postComments by assigning needed variables to another array - fixedComments

  postComments.forEach(({ _id, likes, createdTs, authorId, postId, content }) => {
    fixedComments.push({
      _id,
      likes,
      createdTs,
      authorId,
      postId,
      content,
    })
  })

  let i = 0

  // adding necessary info for each comment about its author (username & avatar)

  for await (const fComment of fixedComments) {
    const fCommentAuthor = await User.findOne({ _id: fComment.authorId })

    fixedComments[i++].author = {
      id: fCommentAuthor.id,
      username: fCommentAuthor.username,
      avatar: fCommentAuthor.avatar,
    }
  }

  const fixedPost = {
    content,
    createdTs,
    attachments,
    hashtags,
    likes,
    id: postid,
    author: {
      id: postAuthor.id,
      username: postAuthor.username,
      avatar: postAuthor.avatar,
    },
    commentsCount: fixedComments.length,
    comments: fixedComments,
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
      session,
      fixedPost: JSON.stringify(fixedPost),
      userId: session ? session.user.id : null,
      fixedTrends: JSON.stringify(fixedTrends),
    },
  }
}
