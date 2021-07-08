import { connectToDatabase } from '../../util/connection'

export default async function getPosts(req, res) {
    const { db } = await connectToDatabase();

    var { page } = req.query
    if (!page) {
        page = 1;
    }

    const postPerPage = 5;

    const count = await db
        .collection("posts")
        .count();

    if ((page - 1) * postPerPage >= count) {
        res.status(500).json({
            message: "page number exceeded."
        })
    }

    const posts = await db
        .collection("posts")
        .find({})
        .sort({ createAt: 1, _id: -1 })
        .skip((page - 1) * postPerPage)
        .limit(postPerPage)
        .toArray();

    res.json({
        maxPage: Math.ceil(count / postPerPage),
        posts
    })
}