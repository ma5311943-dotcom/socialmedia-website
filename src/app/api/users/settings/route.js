import { updateSettings } from '@/controllers/userController';

export async function POST(req) {
    return await updateSettings(req);
}
