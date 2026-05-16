import apiClient from './axios';

/** Uploads an image file and returns its hosted URL. */
export async function uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post('/uploads', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return (
        response.data?.data?.imageUrl ||
        response.data?.imageUrl ||
        response.data?.data ||
        ''
    );
}
