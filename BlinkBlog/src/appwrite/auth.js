import conf from '../conf/conf.js';
import { Client, Account, ID } from 'appwrite';

export class AuthService {
    client = new Client();
    account;

    constructor() {
        // Double-check your path syntax: ensuring it matches your conf structure
        this.client
            .setEndpoint(conf.appWriteUrl || conf.appwrite.appWriteUrl)
            .setProject(conf.appWriteProjectId || conf.appwrite.appWriteProjectId);
        this.account = new Account(this.client);
    }

    async createAccount(email, password, name) {
        try {
            const userAccount = await this.account.create({
                userId: ID.unique(),
                email,
                password,
                name
            });
            
            if (userAccount) {
                // Automatically log the user in upon successful signup
                return await this.login(email, password);
            } 
            return userAccount;
        } catch (error) {
            console.error("AuthService :: createAccount :: error", error);
            throw error;
        }
    }

    async login(email, password) {
        try {
            // Updated to the current preferred Account API syntax
            return await this.account.createEmailSession({
                email,
                password
            });
        } catch (error) {
            console.error("AuthService :: login :: error", error);
            throw error;
        }
    }

    async getCurrentUser() {
        try {
            // Returns current user details if a valid session exists
            return await this.account.get();
        } catch (error) {
            // Gracefully catch unauthenticated (401) states to prevent app crashes
            console.log("AuthService :: getCurrentUser :: User not authenticated");
            return null;
        }
    }

    async logout() {
        try {
            // Destroys the current active session tokens globally
            return await this.account.deleteSession({
                sessionId: 'current'
            });
        } catch (error) {
            console.error("AuthService :: logout :: error", error);
            throw error;
        }
    }
}

const authService = new AuthService();
export default authService;
