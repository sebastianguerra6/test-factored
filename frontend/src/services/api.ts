import axios from 'axios';
import { User, LoginCredentials } from '../types';

const API_URL = 'http://localhost:8001';

export const api = {
    login: async (credentials: LoginCredentials) => {
        const response = await axios.post(`${API_URL}/login`, credentials);
        return response.data;
    },

    getProfile: async (username: string) => {
        const response = await axios.get<User>(`${API_URL}/profile/${username}`);
        return response.data;
    }
}; 