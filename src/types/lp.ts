export interface LpItem {
    id: number;
    title: string;
    uploadDate: string;
    likes: number;
    thumbnail: string;
    content?: string;
}

export interface LpListResponse {
    data: LpItem[];
}
