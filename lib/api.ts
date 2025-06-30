// API Client for Max Your Points CMS
// Uses Next.js API routes for serverless backend

// Always use local API routes (no external backend)
const API_BASE_URL = '';

// API_BASE_URL configured

interface User {
  id: string;
  email: string;
  name: string;
  fullName?: string;
  role: string;
  verified?: boolean;
  createdAt?: string;
  updatedAt?: string;
  lastLogin?: string;
}

interface Article {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  hero_image_url?: string;
  hero_image_alt?: string;
  category_id: string;
  status: 'draft' | 'published' | 'scheduled';
  published_at?: string | null;
  featured_main?: boolean;
  featured_category?: boolean;
  meta_description?: string;
  focus_keyword?: string;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
  author?: any;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  featured?: boolean;
}

import { getApiBaseUrl } from './utils';

// Helper function to get the correct base URL for API calls
function getBaseURL(): string {
  // For client-side requests, always use relative paths
  if (typeof window !== 'undefined') {
    return '';
  }
  // For server-side requests, use the API base URL
  return getApiBaseUrl();
}

class APIClient {
  private token: string | null = null;

  constructor() {
    // Get token from localStorage if available (client-side only)
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    // Construct proper URL for both client and server-side requests
    const baseUrl = getBaseURL();
    const url = baseUrl ? `${baseUrl}/api${endpoint}` : `/api${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
    };

    try {
      console.log(`🌐 Making API request to: ${url}`);
      const response = await fetch(url, config);
      
      console.log(`📡 Response status: ${response.status}, Content-Type: ${response.headers.get('content-type')}`);
      
      // Check if the response is actually JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error(`❌ Expected JSON but got: ${contentType}`);
        console.error(`Response text: ${text.substring(0, 200)}...`);
        throw new Error(`Expected JSON response but got ${contentType}`);
      }
      
      const data = await response.json();

      // Request completed

      if (!response.ok) {
        throw new Error(data.error || data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Auth methods
  async login(email: string, password: string) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (data.token) {
      this.token = data.token;
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', data.token);
      }
    }

    return data;
  }

  async register(email: string, password: string, name: string) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });

    if (data.token) {
      this.token = data.token;
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', data.token);
      }
    }

    return data;
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  logout() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  // Article methods
  async getArticles(params?: { 
    limit?: number; 
    offset?: number; 
    category?: string; 
    published?: boolean;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.offset) searchParams.set('offset', params.offset.toString());
    if (params?.category) searchParams.set('category', params.category);
    if (params?.published !== undefined) searchParams.set('published', params.published.toString());

    const queryString = searchParams.toString();
    return this.request(`/articles${queryString ? `?${queryString}` : ''}`);
  }

  async getArticle(slugOrId: string) {
    return this.request(`/articles/${slugOrId}`);
  }

  async createArticle(articleData: any) {
    // Ensure the data matches backend expectations
    const backendData = {
      title: articleData.title,
      slug: articleData.slug,
      summary: articleData.summary,
      content: articleData.content,
      hero_image_url: articleData.hero_image_url || articleData.heroImageUrl || null,
      hero_image_alt: articleData.hero_image_alt || articleData.heroImageAlt || null,
      category_id: articleData.category_id || articleData.categoryId,
      status: articleData.status || 'draft',
      published_at: articleData.published_at || null,
      featured_main: articleData.featured_main || false,
      featured_category: articleData.featured_category || false,
      meta_description: articleData.meta_description || null,
      focus_keyword: articleData.focus_keyword || null,
      tags: articleData.tags || []
    };

    console.log('Creating article with backend data:', backendData);
    
    return this.request('/articles', {
      method: 'POST',
      body: JSON.stringify(backendData),
    });
  }

  async updateArticle(id: string, articleData: any) {
    // Ensure the data matches backend expectations
    const backendData = {
      title: articleData.title,
      slug: articleData.slug,
      summary: articleData.summary,
      content: articleData.content,
      hero_image_url: articleData.hero_image_url || articleData.heroImageUrl || null,
      hero_image_alt: articleData.hero_image_alt || articleData.heroImageAlt || null,
      category_id: articleData.category_id || articleData.categoryId,
      status: articleData.status || 'draft',
      published_at: articleData.published_at || null,
      featured_main: articleData.featured_main || false,
      featured_category: articleData.featured_category || false,
      meta_description: articleData.meta_description || null,
      focus_keyword: articleData.focus_keyword || null,
      tags: articleData.tags || []
    };

    return this.request(`/articles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(backendData),
    });
  }

  async deleteArticle(id: string) {
    return this.request(`/articles/${id}`, {
      method: 'DELETE',
    });
  }

  // Category methods
  async getCategories() {
    return this.request('/categories');
  }

  async getCategory(slugOrId: string) {
    return this.request(`/categories/${slugOrId}`);
  }

  // User management methods (use authenticated requests)
  async getUsers() {
    return this.request('/admin/users');
  }

  async createUser(userData: { email: string; password: string; name: string; fullName?: string; role?: string }) {
    return this.request('/admin/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(id: string, userData: Partial<User>) {
    return this.request(`/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id: string) {
    return this.request(`/admin/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Media methods (use authenticated requests)
  async uploadFile(formData: FormData) {
    // Use the same URL construction logic as other methods
    const baseUrl = getBaseURL();
    const url = baseUrl ? `${baseUrl}/api/admin/upload` : `/api/admin/upload`;
    
    const config: RequestInit = {
      method: 'POST',
      headers: {
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
      body: formData, // Don't set Content-Type for FormData
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`Upload request failed`, error);
      throw error;
    }
  }

  async getMedia() {
    return this.request('/admin/media');
  }
}

// Create a singleton instance
export const api = new APIClient();

// Export types
export type { User, Article, Category }; 