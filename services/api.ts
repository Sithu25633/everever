
const API_BASE_URL = '/api';

const getHeaders = () => ({
  'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
  'Content-Type': 'application/json'
});

export const authService = {
  register: async (username: string, password: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');
      return data;
    } catch (err: any) {
      console.error("Auth Service Error:", err);
      throw new Error(err.message || 'Server connection failed');
    }
  },
  login: async (username: string, password: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      if (res.status === 404) throw new Error('Backend not found (404)');
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      return data;
    } catch (err: any) {
      console.error("Login Service Error:", err);
      throw new Error(err.message || 'Check if server.js is running');
    }
  }
};

export const memoryService = {
  getStats: async () => {
    const res = await fetch(`${API_BASE_URL}/stats`, { headers: getHeaders() });
    return res.json();
  },
  getFiles: async (type: 'photos' | 'videos', folder: string = '') => {
    const res = await fetch(`${API_BASE_URL}/memories/${type}?folder=${encodeURIComponent(folder)}`, { 
      headers: getHeaders() 
    });
    return res.json();
  },
  createFolder: async (type: 'photos' | 'videos', name: string, parent: string = '') => {
    const res = await fetch(`${API_BASE_URL}/folders/${type}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ name, parent })
    });
    return res.json();
  },
  uploadFiles: async (files: FileList, type: 'photos' | 'videos', folder: string = '') => {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
    const res = await fetch(`${API_BASE_URL}/upload/${type}?folder=${encodeURIComponent(folder)}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` },
      body: formData
    });
    return res.json();
  },
  getLetters: async () => {
    const res = await fetch(`${API_BASE_URL}/letters`, { headers: getHeaders() });
    return res.json();
  },
  saveLetter: async (title: string, content: string) => {
    const res = await fetch(`${API_BASE_URL}/letters`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ title, content })
    });
    return res.json();
  }
};
