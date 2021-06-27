import { connectToDatabase } from '../../util/connection'

export default async function getPosts(req, res) {
    const { db } = await connectToDatabase();

    const posts = await db
        .collection("posts")
        .find({})
        .limit(20)
        .toArray();

    res.json(posts)
}