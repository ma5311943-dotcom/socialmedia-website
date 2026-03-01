import { loginUser } from '@/controllers/userController';


export async function POST(req) {
    return await loginUser(req);
}
