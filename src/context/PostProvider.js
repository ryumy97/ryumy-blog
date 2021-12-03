import React, { useContext, useState, useEffect, createContext } from "react";
import {
    useLocation
} from "react-router-dom";

import { getBlogPosts } from '../services'

const BlogContext = createContext()

export default function PostProvider({children}) {
    const [posts, setPosts] = useState([]);
    const [maxPage, setMaxPage] = useState(0);
    const [pageNumbers, setPageNumbers] = useState([]);

    const query = useQuery();
    let page = query.get("page");

    if (!page) {
        page = 1;
    }

    const getPosts = async (page) => {
        const { maxPage, posts } = await getBlogPosts(page); 

        setMaxPage(maxPage);
        setPosts(posts);
    }

    useEffect(() => {
        getPosts(page);
    }, [page])

    useEffect(() => {
        setPageNumbers(pagination(page, maxPage));
    }, [page, maxPage])

    return (
        <BlogContext.Provider
            value={{
                posts,
                getPosts,
                page,
                maxPage,
                pageNumbers
            }}
        >
            {children}
        </BlogContext.Provider>
    )
}

export function useBlogContext() {
    const blogContext = useContext(BlogContext);

    if (!blogContext) {
        throw Error("Need to wrap with Post Provider");
    }

    return blogContext;
}

function useQuery() {
    const { search } = useLocation();
  
    return React.useMemo(() => new URLSearchParams(search), [search]);
}

const pagination = (page, maxPage) => {
    let j = 0;
    let pages = [];
    for(let i = page - 2; i <= maxPage && i <= page + 5; i++) {
        if (i < 1) {
            continue;
        }
        j++;
        pages.push(i);
        if (j === 5) {
            break;
        }
    }
    return pages;
}