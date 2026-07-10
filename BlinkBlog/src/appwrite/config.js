import conf from '../conf.js';
import { Client, ID, TablesDB, Storage, Query } from 'appwrite';

export class Service {
    client = new Client();
    tablesDB;
    bucket;

    constructor() {
        this.client
            .setEndpoint(conf.appWriteUrl)
            .setProject(conf.appWriteProjectId);
        
        this.tablesDB = new TablesDB(this.client);
        this.bucket = new Storage(this.client);
    }
    
    // ==========================================
    // POST / ROW MANAGEMENT (TablesDB API)
    // ==========================================

    async createPost(Title, Slug, Content, FeaturedImage, Status, UserId) {
        try {
            return await this.tablesDB.createRow({
                databaseId: conf.appWriteDatabaseId,
                tableId: conf.appWriteTableId, // Standardized key name
                rowId: Slug,
                data: { Title, Content, FeaturedImage, Status, UserId }
            });
        } catch (error) {
            console.error("Appwrite Service :: createPost :: error", error);
            throw error;
        }
    }

    async updatePost(Slug, { Title, Content, FeaturedImage, Status }) {
        try {
            return await this.tablesDB.updateRow({
                databaseId: conf.appWriteDatabaseId,
                tableId: conf.appWriteTableId, // Standardized key name
                rowId: Slug,
                data: { Title, Content, FeaturedImage, Status }
            });
        } catch (error) {
            console.error("Appwrite Service :: updatePost :: error", error);
            throw error;
        }
    }

    async deletePost(Slug) {
        try {
            await this.tablesDB.deleteRow({
                databaseId: conf.appWriteDatabaseId,
                tableId: conf.appWriteTableId, // Fixed typo: apWriteCollectionId -> appWriteTableId
                rowId: Slug 
            });
            return true; 
        } catch (error) {
            console.error("Appwrite Service :: deletePost :: error", error);
            return false; 
        }
    }

    async getPost(Slug) {
        try {
            return await this.tablesDB.getRow({
                databaseId: conf.appWriteDatabaseId,
                tableId: conf.appWriteTableId, // Standardized key name
                rowId: Slug 
            });
        } catch (error) {
            console.error("Appwrite Service :: getPost :: error", error);
            return false;
        }
    }

    async getPosts(queries = [Query.equal("Status", "active")]) { // Capitalized "Status" to match your schema schema
        try {
            return await this.tablesDB.listRows({
                databaseId: conf.appWriteDatabaseId,
                tableId: conf.appWriteTableId, // Fixed typo: apWriteCollectionId -> appWriteTableId
                queries
            });
        } catch (error) {
            console.error("Appwrite Service :: getPosts :: error", error);
            return false;
        }
    }

    // ==========================================
    // FILE / STORAGE MANAGEMENT (Storage API)
    // ==========================================

    // Upload an image file 
    async uploadFile(file) {
        try {
            return await this.bucket.createFile({
                bucketId: conf.appWriteBucketId, // Fixed typo: appWriteBuketId -> appWriteBucketId
                fileId: ID.unique(),
                file: file
            });
        } catch (error) {
            console.error("Appwrite Service :: uploadFile :: error", error);
            return false;
        }
    }

    // NEW: Delete an image file from storage (Crucial when a post is deleted)
    async deleteFile(fileId) {
        try {
            await this.bucket.deleteFile({
                bucketId: conf.appWriteBucketId,
                fileId: fileId
            });
            return true;
        } catch (error) {
            console.error("Appwrite Service :: deleteFile :: error", error);
            return false;
        }
    }

    // NEW: Fetch Image Preview URL string (Sync method, returns a URL directly)
    getFilePreview(fileId) {
        try {
            return this.bucket.getFilePreview({
                bucketId: conf.appWriteBucketId,
                fileId: fileId
            });
        } catch (error) {
            console.error("Appwrite Service :: getFilePreview :: error", error);
            return false;
        }
    }
}

const service = new Service();
export default service;
