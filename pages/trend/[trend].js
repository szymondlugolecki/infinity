import { useState, useEffect } from 'react'
import Head from 'next/head'
import { getSession } from 'next-auth/client'
import LeftPanel from '../../comps/LeftPanel'
import RightPanel from '../../comps/RightPanel'
import Post from '../../models/Post'
import User from '../../models/User'
import dbConnect from '../../lib/mongodb'
import PostComponent from '../../comps/Post'
import Trend from '../../models/Trend'
import Comment from '../../models/Comment'

import styles from '../../styles/Trend.module.css'

export default function TrendPage({ me, session, fixedPosts, fixedTrends, trend }) {
  const [posts, setPosts] = useState(fixedPosts ? JSON.parse(fixedPosts) : [])
  if (JSON.stringify(posts) !== fixedPosts) setPosts(JSON.parse(fixedPosts))

  return (
    <div className='container'>
      <Head>
        <title>{`#${trend} / Infinity`}</title>
        <meta key='description' name='description' content={`Infinity ${trend} Trend Page`}></meta>
        <link rel='icon' href='/logo.png' />
      </Head>
      <LeftPanel session={session} />
      <div className={styles.mainContent}>
        <section className={styles.homePagePosts}>
          {posts.map((post, index) => (
            <PostComponent key={index} post={post} userId={me.id} />
          ))}
        </section>
      </div>
      <RightPanel fixedTrends={fixedTrends} />
    </div>
  )
}

export async function getServerSideProps({ req, params: { trend } }) {
  // trend - all posts listed containing specified hashtag

  const session = await getSession({ req })

  await dbConnect()

  // check if the trend exists

  const trendCount = await Trend.countDocuments({ name: trend })
  if (trendCount == 0)
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }

  // fetch 20 (for performance) latest posts

  const trendPosts = await Post.find({ hashtags: '#' + trend })
    .sort({ createdTs: -1 })
    .limit(20)

  const fixedPostsArray = []

  // minify & unfreeze trendPosts by assigning needed variables to another array - fixedPostsArray

  for await (const { content, createdTs, authorId, likes, attachments, hashtags, _id } of trendPosts) {
    const author = await User.findOne({ _id: authorId })
    const comments = await Comment.countDocuments({ postId: _id })

    fixedPostsArray.push({
      content,
      createdTs,
      likes,
      attachments,
      hashtags,
      id: _id,
      author: {
        id: author._id,
        username: author.username,
        avatar: author.avatar,
      },
      commentsCount: comments,
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
      trend,
    },
  }
}
