import { Injectable } from '@angular/core';
import axios from 'axios';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private baseURL = 'http://localhost:5000'; // Adjust if backend port differs

    constructor(private cookieService: CookieService) {
        axios.interceptors.request.use(config => {
            const token = this.cookieService.get('auth_token');
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
            return config;
        });
    }

    get(endpoint: string) {
        return axios.get(`${this.baseURL}/${endpoint}`);
    }

    post(endpoint: string, data: any) {
        return axios.post(`${this.baseURL}/${endpoint}`, data);
    }

    put(endpoint: string, data: any) {
        return axios.put(`${this.baseURL}/${endpoint}`, data);
    }

    delete(endpoint: string) {
        return axios.delete(`${this.baseURL}/${endpoint}`);
    }
}
