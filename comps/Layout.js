import dbConnect from '../lib/mongodb'

export default function Layout({ children }) {
  return <main className='layout fullCenter'>{children}</main>
}

export async function getServerSideProps(context) {
  await dbConnect()

  return {
    props: {},
  }
}
