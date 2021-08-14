import Link from 'next/link'
import { useState } from 'react'
import { dateParser } from '../lib/util'

import styles from '../styles/Comment.module.css'

export default function Comment({ comment, userId }) {
  const expr = userId && comment.likes.includes(userId)
  const [love, setLoved] = useState(expr ? true : false)
  const [lovers, setLovers] = useState(comment.likes.length)

  const likeComment = () => {
    fetch('../api/comment/like', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ like: !love, commentId: comment._id }),
    }).catch(console.error)
  }

  const handleLove = () => {
    if (love) setLovers(lovers - 1)
    else setLovers(lovers + 1)
    setLoved((prevState) => !prevState)

    likeComment()
  }

  return (
    <article className={styles.commentMini}>
      <div className={styles.postLeftSide + ' fullCenter'}>
        <div className={styles.postAuthorAvatar + ' fullCenter'}>
          <Link href={`/profile/${comment.author.username}`}>
            <a className={styles.postHyperlinks}>
              <img
                src={comment.author.avatar}
                alt={`${comment.author.username}'s avatar'`}
                width='40px'
                height='40px'
              ></img>
            </a>
          </Link>
        </div>
      </div>
      <div className={styles.postRightSide}>
        <div className={styles.postTopPanelMetadata}>
          <Link href={`/profile/${comment.author.username}`}>
            <a className={styles.postHyperlinks}>{comment.author.username}</a>
          </Link>
          <span className={styles.postTopMetaBreak}>•</span>
          <span className={styles.postCreationDate}>{dateParser(comment.createdTs)}</span>
        </div>
        <div className={styles.postMessage}>
          <span>{comment.content}</span>
        </div>
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
        </div>
      </div>
    </article>
  )
}
