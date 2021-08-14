import Link from 'next/link'
import { useState } from 'react'
import { dateParser } from '../lib/util'

import styles from '../styles/Post.module.css'

export default function Post({ post, userInfo, userId }) {
  const expr = userId && post.likes.includes(userId)
  const [love, setLoved] = useState(expr ? true : false)
  const [lovers, setLovers] = useState(post.likes.length)

  const userUsername = userInfo ? userInfo.username : post.author.username

  const likePost = () => {
    fetch('../api/post/like', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ like: !love, postId: post.id }),
    }).catch(console.error)
  }

  const handleLove = (e) => {
    e.preventDefault()
    if (love) setLovers(lovers - 1)
    else setLovers(lovers + 1)
    setLoved((prevState) => !prevState)

    likePost()
  }

  return (
    <Link href={`/post/${post.id}`}>
      <article className={styles.postMini}>
        <div className={styles.postLeftSide + ' fullCenter'}>
          <div className={styles.postAuthorAvatar + ' fullCenter'}>
            <Link href={`/profile/${userUsername}`}>
              <a className={styles.postHyperlinks}>
                <img
                  src={userInfo ? userInfo.avatar : post.author.avatar}
                  alt={`${userUsername}'s avatar'`}
                  width='50px'
                  height='50px'
                ></img>
              </a>
            </Link>
          </div>
        </div>
        <div className={styles.postRightSide}>
          <div className={styles.postTopPanelMetadata}>
            <Link href={`/profile/${userUsername}`}>
              <a className={styles.postHyperlinks}>{userUsername}</a>
            </Link>
            <span className={styles.postTopMetaBreak}>•</span>
            <span className={styles.postCreationDate}>{dateParser(post.createdTs)}</span>
            {post.hashtags.length > 0 && <span className={styles.postTopMetaBreak}>•</span>}
            {post.hashtags.map((hashtag, index) => {
              if (post.hashtags.length > 3 && index > 2) return
              return (
                <span key={index} className={styles.postTags}>
                  {hashtag}
                </span>
              )
            })}
          </div>
          <div className={styles.postMessage}>
            <span>{post.content}</span>
          </div>
          {post.attachments[0] && (
            <div className={styles.postImage}>
              <img
                src={post.attachments[0]}
                alt='image attached to the post'
                width='500px'
                height='280px'
              ></img>
            </div>
          )}
          <div className={styles.postBottomPanelMetadata}>
            <div className={styles.commentFeedbackElement}>
              {userId && (
                <span onClick={handleLove}>
                  <img
                    alt='heart button click if you love the comment'
                    src='/love.svg'
                    width='18px'
                    height='18px'
                    className={love ? styles.lovedComment : styles.notLovedComment}
                  ></img>
                  <span className={styles.loversCount}>{lovers}</span>
                </span>
              )}
              {!userId && (
                <span onClick={(e) => e.preventDefault()}>
                  <img
                    src='/love.svg'
                    width='18px'
                    height='18px'
                    className={styles.notLovedComment}
                    alt='heart button you cant click it because you are not logged in'
                  ></img>
                  <span className={styles.loversCount}>{lovers}</span>
                </span>
              )}
            </div>
            <div className={styles.commentFeedbackElement}>
              <span>
                <img
                  src='/comment.svg'
                  width='18px'
                  height='18px'
                  className={styles.postComment}
                  alt='comment icon'
                ></img>
                <span className={styles.loversCount}>{post.commentsCount}</span>
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}
