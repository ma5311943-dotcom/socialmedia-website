import { addComment } from '@/controllers/postController';


export async function POST(req) {
    return await addComment(req);
}
