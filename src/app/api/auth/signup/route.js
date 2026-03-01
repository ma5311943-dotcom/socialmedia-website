import { registerUser } from '@/controllers/userController';


export async function POST(req) {
    return await registerUser(req);
}
