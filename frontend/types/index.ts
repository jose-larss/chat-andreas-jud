export interface UserType {
    id: string,
    username: string, 
    status: string, 
    is_online: boolean, 
    avatar: string,
}

export interface MessageType {
    id: string, 
    author: UserType, 
    text: string, 
    image: string, 
    created_at: string,
}