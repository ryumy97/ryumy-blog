import { useContext, useState, useEffect, createContext } from "react";
import { useRouter } from 'next/router';
import axios from 'axios'

const BlogContext = createContext()

export default function PostProvider({children}) {
    const [posts, setPosts] = useState([]);
    const [maxPage, setMaxPage] = useState(0);
    const [pageNumbers, setPageNumbers] = useState([]);

    const router = useRouter();
    const { page } = router.query;

    if (!page) {
        router.query.page = 1;
    }

    function getPosts() {
        axios.get("/api/blog-api", {
            params: {
                page: page
            }
        })
        .then(response => {
            const { maxPage, posts } = response.data;
            setPosts(posts);
            setMaxPage(maxPage);
        })
    }

    useEffect(() => {
        getPosts(page);
    }, [page])

    const pagination = () => {
        let j = 0;
        let pages = [];
        for(let i = page - 2; i <= maxPage && i <= page + 5; i++) {
            if (i < 1) {
                continue;
            }
            j++;
            pages.push(i);
            if (j == 5) {
                break;
            }
        }
        return pages;
    }

    useEffect(() => {
        setPageNumbers(pagination());
    }, [maxPage])

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