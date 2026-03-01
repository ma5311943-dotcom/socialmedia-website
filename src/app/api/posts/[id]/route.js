import { deletePost } from '@/controllers/postController';

export async function DELETE(req, { params }) {
    return await deletePost(req, { params });
}
