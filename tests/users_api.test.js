const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const User = require("../models/users");

const api = supertest(app);

describe('check that invalid users are not created and responses with correct http status code',()=>{
    test('username must be provided', async ()=>{
        const user = {
            name: "Alberto",
            password:"12345"
        }
        const response = await api.post('/api/users').send(user).expect(400)
        expect(response.body.error).toBe('username must be given')
    })

    test('password must be provided', async ()=>{
        const user = {
            name: "Alberto",
            username:"12345"
        }
        const response = await api.post('/api/users').send(user).expect(400)
        expect(response.body.error).toBe('password must be given')
    })
    test('username must be 3 characters long', async ()=>{
        const user = {
            name: "Alberto",
            username: "al",
            password:"12345"
        }
        const response = await api.post('/api/users').send(user).expect(400)
        expect(response.body.error).toBe('username must be at least 3 characters long')
    })

    test('password must be 3 characters long', async ()=>{
        const user = {
            name: "Alberto",
            username:"12345",
            password: "12"
        }
        const response = await api.post('/api/users').send(user).expect(400)
        expect(response.body.error).toBe('password must be at least 3 characters long')
    })

    test('username must be unique',async ()=>{
        const user = {
            name: "Alberto",
            username:"12345",
            password: "12345"
        };
        const newUser = new User(user);
        await newUser.save();

        const response = await api.post('/api/users').send(user).expect(400);
        expect(response.body.error).toBe('username must be unique')

        await User.deleteOne(user);

    })
})