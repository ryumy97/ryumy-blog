import { useContext, useState, useEffect, createContext } from "react";

const BlogContext = createContext()

export default function PostProvider({children}) {
    const [posts, setPosts] = useState([]);
    
    function getPosts() {
        console.log("getPosts")
        fetch("/api/blog-api")
        .then(response => {
            console.log(response)
            return response.json()
        })
        .then(data => {
            console.log("data")
            console.log(data)
            setPosts(data);
        })
    }

    useEffect(() => {
        getPosts();
    }, [])

    return (
        <BlogContext.Provider
            value={{
                posts,
                getPosts
            }}
        >
            {children}
        </BlogContext.Provider>
    )
}

export function useBlogContext() {
    const blogContext = useContext(BlogContext);
    console.log(blogContext)
    if (!blogContext) {
        throw Error("Need to wrap with Post Provider");
    }

    return blogContext;
}