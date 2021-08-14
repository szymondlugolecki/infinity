import Link from 'next/link'

const Logo = () => {
  return (
    <div className='logoContainer'>
      <Link href='/'>
        <a>
          <img src='/logo.png' alt={'infinity logo'}></img>
        </a>
      </Link>
    </div>
  )
}

export default Logo
