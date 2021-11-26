import React from 'react'
import Layout from '../components/Layout'
import { useBlogContext } from '../context/PostProvider'
import Article from '../components/Article';
import Pagination from '../components/Pagination';

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
      <Pagination page={page} pageNumbers={pageNumbers} maxPage={maxPage}/>
    </Layout>
  )
}
