export interface Tag {
    id: number;
    name: string;
}

export interface Like {
    id: number;
    userId: number;
    lpId: number;
}

export interface Author {
    id: number;
    name: string;
    email?: string;
    bio?: string | null;
    avatar?: string | null;
}

export interface LpItem {
    id: number;
    title: string;
    content: string;
    thumbnail: string;
    published?: boolean;
    authorId?: number;
    createdAt: string;
    updatedAt?: string;
    tags: Tag[];
    likes: Like[];
    author?: Author;
}

export interface LpListResponse {
    data: LpItem[];
}

export interface Comment {
    id: number;
    content: string;
    lpId: number;
    authorId: number;
    createdAt: string;
    updatedAt?: string;
    author?: Author;
}

export interface CreateLpPayload {
    title: string;
    content: string;
    thumbnail: string;
    tags: string[];
    published?: boolean;
}
