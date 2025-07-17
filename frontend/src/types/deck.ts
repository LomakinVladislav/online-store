export interface IDeckData {
    id: number;
    creator_user_id: number;
    title: string;
    category: string;
    description: string;
    created_at: string;
    updated_at: string;
    is_public: boolean;
    difficulty: number;
    image_url: string;
}