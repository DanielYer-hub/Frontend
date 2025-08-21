import axios from 'axios';
import { saveToStorage, getFromStorage, removeFromStorage } from '../utils/storage';

const API_URL = import.meta.env.VITE_API_URL;

export const authService = {
  async register(userData: object) {
    const response = await axios.post(`${API_URL}/users`, userData);
    console.log("User registered:", response.data);
    return response.data;
  },

  async login(credentials: { email: string; password: string }) {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    const { token } = response.data;
    saveToStorage('token', token); 
    return token;
  },
 

  logout() {
    removeFromStorage('token'); 
    removeFromStorage('user');
  },

  getToken() {
    return getFromStorage('token'); 
  }
};