import chai from 'chai';
import chaiHttp from 'chai-http';
import { app } from '../src/app.js';
import mongoose from 'mongoose';

const { expect } = chai;
chai.use(chaiHttp);

describe('User Routes', () => {
    before((done) => {
        mongoose.connection.collections.users.drop(() => {
            done();
        });
    });

    it('should register a new user', (done) => {
        const user = {
            first_name: 'Test',
            last_name: 'User',
            email: 'testuser@example.com',
            password: 'password123'
        };

        chai.request(app)
            .post('/api/sessions/register')
            .send(user)
            .end((err, res) => {
                expect(res).to.have.status(201);
                expect(res.body).to.have.property('status', 'success');
                done();
            });
    });

    it('should login the user', (done) => {
        const user = {
            email: 'testuser@example.com',
            password: 'password123'
        };

        chai.request(app)
            .post('/api/sessions/login')
            .send(user)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('token');
                done();
            });
    });

    it('should not login with incorrect password', (done) => {
        const user = {
            email: 'testuser@example.com',
            password: 'wrongpassword'
        };

        chai.request(app)
            .post('/api/sessions/login')
            .send(user)
            .end((err, res) => {
                expect(res).to.have.status(401);
                expect(res.body).to.have.property('status', 'error');
                done();
            });
    });
});
