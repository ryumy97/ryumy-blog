import React, { useEffect } from 'react'
import Head from 'next/head'
import Layout from '../components/Layout'
import { useBlogContext } from '../context/PostProvider'

export default function Home() {
  const { posts, getPosts } = useBlogContext();

  return (
    <>
      {posts.map(({ title, category, createdAt, content, _id }) => {
        console.log(createdAt)
        return (
          <Layout key={_id} title={title} category={category} date={new Date(createdAt)}>
            {content}
          </Layout>
        )
      })}
    </>
  )
}
