import { updateProfile } from '@/controllers/userController';



export async function POST(req) {
    return await updateProfile(req);
}
