import { DataSource } from 'apollo-datasource';
import { ewRequest } from './ewRequest';
import { logger } from 'log';

export class BookService extends DataSource {
    constructor() {
        super();
    }

    baseUrl = 'https://ewdemo.test.edgekey.net/mockapi'
    
    initialize() {}

    async getAuthors(id:string[] = []) {
        let endpoint = '/authors';
        let query = id.reduce((prev, value) => { (prev == '') ? prev += `?id=${value}` : prev += `&id=${value}`; return prev }, '')
        let res = await ewRequest(this.baseUrl + endpoint + query);
        if (res.ok) {
            let json = await res.json();
            if (Array.isArray(json)) json = json.map( v => Object.assign(v, { 'debug':res.debug }) )
            return json;
        }
        return [];
    }
    
    async getAuthor(id) {
        let authors = this.getAuthors([id]);
        if (Array.isArray(authors) && authors.length) {
            return authors[0];
        }
        return {};
    }
    
    async getPublishers(id:string[] = []) {
        let endpoint = '/publishers';
        let query = id.reduce((prev, value) => { (prev == '') ? prev += `?id=${value}` : prev += `&id=${value}`; return prev }, '')
        let res = await ewRequest(this.baseUrl + endpoint + query);
        if (res.ok) {
            let json = await res.json();
            if (Array.isArray(json)) json = json.map( v => Object.assign(v, { 'debug':res.debug }) )
            return json;
        }
        return [];
    }
    
    async getPublisher(id) {
        let publishers = await this.getPublishers([id]);
        if (Array.isArray(publishers) && publishers.length) {
            return publishers[0];
        }
        return {};    
    }
    
    async getBooks(id:string[] = []) {
        let endpoint = '/books';
        let query = id.reduce((prev, value) => { (prev == '') ? prev += `?id=${value}` : prev += `&id=${value}`; return prev }, '')
        let res = await ewRequest(this.baseUrl + endpoint + query);
        if (res.ok) {
            let json = await res.json();
            if (Array.isArray(json)) json = json.map( v => Object.assign(v, { 'debug':res.debug }) )
            return json;
        }
        return [];
    }

    async getBook(id) {
        let books = await this.getBooks([id]);
        if (Array.isArray(books) && books.length) {
            return books[0];
        }
        return {};
    }
}

export const dataSources = {
    bookService: new BookService()
};
