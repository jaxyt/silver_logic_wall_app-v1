'use strict';

const bcryptjs = require('bcryptjs');
const Context = require('./context');

class Database {
    constructor(seedData, enableLogging) {
        this.posts = seedData.posts;
        this.users = seedData.users;
        this.enableLogging = enableLogging;
        this.context = new Context('silver-wall-api.db', enableLogging);
    }

    log(message) {
        if (this.enableLogging) {
            console.info(message);
        }
    }

    tableExists(tableName) {
        this.log(`Checking if the ${tableName} table exists...`);

        return this.context
            .retrieveValue(`
                SELECT EXISTS (
                    SELECT 1
                    FROM sqlite_master
                    WHERE type = 'table' AND name = ?
                );
            `, tableName);
    }

    createUser(user) {
        return this.context
            .execute(`
                INSERT INTO Users
                    (username, emailAddress, password, createdAt, updatedAt)
                VALUES
                    (?, ?, ?, datetime('now'), datetime('now'));
            `,
            user.username,
            user.emailAddress,
            user.password);
    }

    createPost(post) {
        return this.context
        .execute(`
            INSERT INTO Posts
                (userId, postContent, createdAt, updatedAt)
            VALUES
                (?, ?, datetime('now'), datetime('now'));
        `,
        post.userId,
        post.postContent);
    }

    async hashUserPasswords(users) {
        const usersWithHashedPasswords = [];

        for (const user of users) {
            const hashedPassword = await bcryptjs.hash(user.password, 10);
            usersWithHashedPasswords.push({ ...user, password: hashedPassword });
        }

        return usersWithHashedPasswords;
    }

    async createUsers(users) {
        for (const user of users) {
            await this.createUser(user);
        }
    }

    async createPosts(posts) {
        for (const post of posts) {
            await this.createPost(post);
        }
    }

    async init() {
        const userTableExists = await this.tableExists('Users');

        if (userTableExists) {
            this.log('Dropping the Users table...');

            await this.context.execute(`
                DROP TABLE IF EXISTS Users;
            `);
        }

        this.log('Creating the Users table...');

        await this.context.execute(`
            CREATE TABLE Users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username VARCHAR(255) NOT NULL DEFAULT '',
                emailAddress VARCHAR(255) NOT NULL DEFAULT '' UNIQUE,
                password VARCHAR(255) NOT NULL DEFAULT '',
                createdAt DATETIME NOT NULL,
                updatedAt DATETIME NOT NULL
            );
        `);

        this.log('Hashing the user passwords...');

        const users = await this.hashUserPasswords(this.users);

        this.log('Creating the user records...');

        await this.createUsers(users);

        const postTableExists = await this.tableExists('Posts');

        if (postTableExists) {
            this.log('Dropping the Posts table...');

            await this.context.execute(`
                DROP TABLE IF EXISTS Posts;
            `);
        }

        this.log('Creating the Posts table...');

        await this.context.execute(`
            CREATE TABLE Posts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                postContent TEXT NOT NULL DEFAULT '',
                createdAt DATETIME NOT NULL,
                updatedAt DATETIME NOT NULL,
                userId INTEGER NOT NULL DEFAULT -1
                    REFERENCES Users (id) ON DELETE CASCADE ON UPDATE CASCADE
            );
        `);

        this.log('Creating the posts records...');

        await this.createPosts(this.posts);

        this.log('Database successfully initialized!');
    }
}

module.exports = Database;