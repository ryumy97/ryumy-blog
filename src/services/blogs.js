import axios from "axios";

const REACT_APP_SERVER_URI = process.env.REACT_APP_SERVER_URI

export async function getBlogPosts(page) {
    console.log(REACT_APP_SERVER_URI)
    const data = await axios.get(`${REACT_APP_SERVER_URI ? REACT_APP_SERVER_URI : ''}/api/blog`, {
        params: {
            page
        }
    })
    .then(response => {
        return response.data
    })

    return data;

}