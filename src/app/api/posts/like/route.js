import { toggleLike } from '@/controllers/postController';


export async function POST(req) {
    return await toggleLike(req);
}
