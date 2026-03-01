import { getProfile } from '../../../controllers/userController';

export async function GET(req) {
    return await getProfile(req);
}
