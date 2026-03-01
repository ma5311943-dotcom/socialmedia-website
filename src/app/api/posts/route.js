import { createPost, getPosts } from '../../../controllers/postController';

export async function GET() {
    return await getPosts();
}

export async function POST(req) {
    return await createPost(req);
}
