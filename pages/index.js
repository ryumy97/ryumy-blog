import React, { useEffect } from 'react'
import Head from 'next/head'
import Layout from '../components/Layout'
import { useBlogContext } from '../context/PostProvider'
import Article from '../components/Article';
import Link from 'next/link';
import utilStyles from '../styles/utilStyles.module.css'

export default function Home() {
  const { posts, page, maxPage, pageNumbers } = useBlogContext();

  return (
    <Layout>
      {posts.map(({ title, category, createdAt, content, _id }) => {
        return (
          <Article key={_id} title={title} category={category} date={new Date(createdAt)}>
            {content}
          </Article>
        )
      })}
      
      {page != 1
      ? <Link href={{
        pathname: '/',
        query: { page: 1 }
      }}>      
        <span className={utilStyles.link}>{"<<"}</span>
      </Link>
      : null}

      {pageNumbers.map(_ => {
        console.log(page)
        console.log(_)
        return (
          <Link 
            key={_}
            href={{
            pathname: '/',
            query: { page: _ }
          }}>
            {page == _
              ? <span className={utilStyles.currentLink}>
                {_}
              </span>
              : <span className={utilStyles.link}>
                {_}
              </span>
            }
          </Link>
        )
      })}
      
      {page != maxPage
      ? <Link href={{
        pathname: '/',
        query: { page: maxPage }
      }}>      
        <span className={utilStyles.link}>{">>"}</span>
      </Link>
      : null}

    </Layout>
  )
}
