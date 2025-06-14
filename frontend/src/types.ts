export interface Skill {
    name: string;
    level: number;
}

export interface User {
    id: number;
    username: string;
    name: string;
    position: string;
    avatar_url: string;
    skills: Skill[];
}

export interface LoginCredentials {
    username: string;
    password: string;
} 