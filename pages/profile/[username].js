import { useState } from 'react'
import Head from 'next/head'
import { getSession } from 'next-auth/client'
import LeftPanel from '../../comps/LeftPanel'
import RightPanel from '../../comps/RightPanel'
import Post from '../../models/Post'
import User from '../../models/User'
import Comment from '../../models/Comment'
import dbConnect from '../../lib/mongodb'
import PostComponent from '../../comps/Post'
import { dateParser } from '../../lib/util'
import Trend from '../../models/Trend'

import styles from '../../styles/Profile.module.css'

export default function MyProfile({ me, session, fixedPosts, userInfo, fixedTrends }) {
  const [posts, setPosts] = useState(fixedPosts ? JSON.parse(fixedPosts) : [])

  return (
    <div className='container'>
      <Head>
        <title>{`@${userInfo.username} / Infinity`}</title>
        <meta
          key='description'
          name='description'
          content={`Infinity ${userInfo.username} User Profile Page`}
        ></meta>
        <link rel='icon' href='/logo.png' />
      </Head>
      <LeftPanel session={session} />
      <div className={styles.mainContent}>
        <div className={styles.profileBox}>
          <div className={styles.profileBoxLeftContainer}>
            <img
              width='100px'
              height='100px'
              src={userInfo.avatar}
              alt={`${userInfo.username}'s avatar'`}
            ></img>
          </div>
          <div className={styles.profileBoxRightContainer}>
            <div className={styles.profileBoxUsernameContainer}>
              <span>{userInfo.username}</span>
            </div>
            <div className={styles.profileBoxBioContainer}>
              <span>{userInfo.bio ? userInfo.bio : 'No information given'}</span>
            </div>
            <div className={styles.profileBoxJoinedContainer}>
              <span>📅 Joined {dateParser(userInfo.joinedTs, false)}</span>
            </div>
          </div>
        </div>
        <div className={styles.profileAndPostsBreak}></div>
        <section className={styles.homePagePosts}>
          {posts.map((post, index) => (
            <PostComponent key={index} post={post} userInfo={userInfo} userId={me.id} />
          ))}
        </section>
      </div>
      <RightPanel fixedTrends={fixedTrends} />
    </div>
  )
}

export async function getServerSideProps({ req, params: { username } }) {
  // profile of specified user

  const session = await getSession({ req })

  await dbConnect()

  // check if the user exists

  const user = await User.findOne({ username })
  if (!user || JSON.stringify(user) == 'null')
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }

  // fetch 20 (for performance) latest posts

  const userPosts = await Post.find({ authorId: user._id }).sort({ createdTs: -1 }).limit(20)

  const fixedPostsArray = []
  const userInfo = {
    id: user._id,
    username: user.username,
    avatar: user.avatar,
    bio: user.bio,
    joinedTs: user.joinedTs,
  }

  // minify & unfreeze userPosts by assigning needed variables to another array - fixedPostsArray

  for await (const { content, createdTs, authorUsername, likes, attachments, hashtags, _id } of userPosts) {
    const comments = await Comment.countDocuments({ postId: _id })

    fixedPostsArray.push({
      id: _id,
      content,
      createdTs,
      authorUsername,
      likes,
      attachments,
      hashtags,
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
      userInfo,
      fixedTrends: JSON.stringify(fixedTrends),
    },
  }
}
