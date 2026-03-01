import { toggleFollow } from '@/controllers/userController';



export async function POST(req) {
    return await toggleFollow(req);
}
