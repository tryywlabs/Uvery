import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import { expect } from 'chai';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import * as userController from '../userController.js';
import User from '../../model/userModel.js';

// Configure chai
chai.use(chaiHttp);

describe('User Controller Tests', () => {
  let req, res, next;
  let userStub;
  let bcryptStub;
  let jwtStub;

  beforeEach(() => {
    // Setup request and response objects with spies
    req = {
      body: {},
      params: {},
      user: {},
    };

    res = {
      status: sinon.stub().returns({
        json: sinon.spy(),
      }),
    };

    next = sinon.spy();

    // Restore all stubs after each test
    sinon.restore();
  });

  describe('1. createUser', () => {
    it('should create a new user successfully', async () => {
      // Setup
      req.body = {
        email: 'test@university.edu',
        password: 'password123',
        username: 'testuser',
        institutionType: 'university',
      };

      // Mock User.findOne to return null (user doesn't exist)
      userStub = sinon.stub(User, 'findOne').resolves(null);

      // Mock bcrypt.genSalt and hash
      const saltStub = sinon.stub(bcrypt, 'genSalt').resolves('salt');
      const hashStub = sinon.stub(bcrypt, 'hash').resolves('hashedPassword');

      // Mock User.save
      const saveStub = sinon.stub().resolves({
        _id: 'user123',
        email: 'test@university.edu',
        username: 'testuser',
      });

      // Mock User constructor
      sinon.stub(mongoose.model('User'), 'prototype').returns({
        save: saveStub,
      });

      // Execute
      await userController.createUser(req, res);

      // Assert
      expect(res.status.calledWith(201)).to.be.true;
      expect(saveStub.calledOnce).to.be.true;
    });

    it('should return 400 if user already exists', async () => {
      // Setup
      req.body = {
        email: 'existing@university.edu',
        password: 'password123',
      };

      // Mock User.findOne to return a user
      userStub = sinon.stub(User, 'findOne').resolves({
        _id: 'user123',
        email: 'existing@university.edu',
      });

      // Execute
      await userController.createUser(req, res);

      // Assert
      expect(res.status.calledWith(400)).to.be.true;
      expect(res.status().json.args[0][0].errorMessage).to.include(
        'already exists'
      );
    });

    it('should return 400 if email domain is invalid', async () => {
      // Setup
      req.body = {
        email: 'test@invalid.com', // Non-educational domain
        password: 'password123',
      };

      // Mock User.findOne to return null
      userStub = sinon.stub(User, 'findOne').resolves(null);

      // Execute
      await userController.createUser(req, res);

      // Assert
      expect(res.status.calledWith(400)).to.be.true;
      expect(res.status().json.args[0][0].message).to.include(
        'Invalid education domain'
      );
    });

    it('should return 500 if there is a server error', async () => {
      // Setup
      req.body = {
        email: 'test@university.edu',
        password: 'password123',
      };

      // Mock User.findOne to throw an error
      userStub = sinon
        .stub(User, 'findOne')
        .throws(new Error('Database error'));

      // Execute
      await userController.createUser(req, res);

      // Assert
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.status().json.args[0][0].errorMessage).to.include(
        'Server Error'
      );
    });
  });

  describe('2. getAllUsers', () => {
    it('should return all users successfully', async () => {
      // Setup
      const users = [
        { _id: 'user1', email: 'user1@university.edu' },
        { _id: 'user2', email: 'user2@college.edu' },
      ];

      // Mock User.find to return users
      userStub = sinon.stub(User, 'find').resolves(users);

      // Execute
      await userController.getAllUsers(req, res);

      // Assert
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.status().json.calledWith(users)).to.be.true;
    });

    it('should return 404 if no users are found', async () => {
      // Setup
      // Mock User.find to return empty array
      userStub = sinon.stub(User, 'find').resolves([]);

      // Execute
      await userController.getAllUsers(req, res);

      // Assert
      expect(res.status.calledWith(404)).to.be.true;
      expect(res.status().json.args[0][0].message).to.include('No users found');
    });

    it('should return 500 if there is a server error', async () => {
      // Mock User.find to throw an error
      userStub = sinon.stub(User, 'find').throws(new Error('Database error'));

      // Execute
      await userController.getAllUsers(req, res);

      // Assert
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.status().json.args[0][0].errorMessage).to.include(
        'Server Error'
      );
    });
  });

  describe('3. getUserById', () => {
    it('should return a user by ID successfully', async () => {
      // Setup
      req.params = { id: 'user123' };
      const user = { _id: 'user123', email: 'user@university.edu' };

      // Mock User.findById to return a user
      userStub = sinon.stub(User, 'findById').resolves(user);

      // Execute
      await userController.getUserById(req, res);

      // Assert
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.status().json.calledWith(user)).to.be.true;
    });

    it('should return 404 if user is not found', async () => {
      // Setup
      req.params = { id: 'nonexistent' };

      // Mock User.findById to return null
      userStub = sinon.stub(User, 'findById').resolves(null);

      // Execute
      await userController.getUserById(req, res);

      // Assert
      expect(res.status.calledWith(404)).to.be.true;
      expect(res.status().json.args[0][0].message).to.include('not found');
    });

    it('should return 500 if there is a server error', async () => {
      // Setup
      req.params = { id: 'user123' };

      // Mock User.findById to throw an error
      userStub = sinon
        .stub(User, 'findById')
        .throws(new Error('Database error'));

      // Execute
      await userController.getUserById(req, res);

      // Assert
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.status().json.args[0][0].errorMessage).to.include(
        'Error fetching user'
      );
    });
  });

  describe('4. updateUser', () => {
    it('should update user successfully', async () => {
      // Setup
      req.params = { id: 'user123' };
      req.body = { username: 'updatedname' };

      // Mock User.findById to return a user
      const findByIdStub = sinon.stub(User, 'findById').resolves({
        _id: 'user123',
        email: 'user@university.edu',
      });

      // Mock User.findByIdAndUpdate
      const updateStub = sinon.stub(User, 'findByIdAndUpdate').resolves({
        _id: 'user123',
        email: 'user@university.edu',
        username: 'updatedname',
      });

      // Execute
      await userController.updateUser(req, res);

      // Assert
      expect(findByIdStub.calledWith('user123')).to.be.true;
      expect(updateStub.calledWith('user123', req.body, { new: true })).to.be
        .true;
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.status().json.args[0][0].message).to.include(
        'updated successfully'
      );
    });

    it('should return 404 if user is not found', async () => {
      // Setup
      req.params = { id: 'nonexistent' };
      req.body = { username: 'updatedname' };

      // Mock User.findById to return null
      userStub = sinon.stub(User, 'findById').resolves(null);

      // Execute
      await userController.updateUser(req, res);

      // Assert
      expect(res.status.calledWith(404)).to.be.true;
      expect(res.status().json.args[0][0].message).to.include('not found');
    });

    it('should return 500 if there is a server error', async () => {
      // Setup
      req.params = { id: 'user123' };
      req.body = { username: 'updatedname' };

      // Mock User.findById to throw an error
      userStub = sinon
        .stub(User, 'findById')
        .throws(new Error('Database error'));

      // Execute
      await userController.updateUser(req, res);

      // Assert
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.status().json.args[0][0].errorMessage).to.include(
        'Error updating user'
      );
    });
  });

  describe('5. deleteUser', () => {
    it('should delete user successfully', async () => {
      // Setup
      req.params = { id: 'user123' };

      // Mock User.findById to return a user
      const findByIdStub = sinon.stub(User, 'findById').resolves({
        _id: 'user123',
        email: 'user@university.edu',
      });

      // Mock User.findByIdAndDelete
      const deleteStub = sinon.stub(User, 'findByIdAndDelete').resolves({});

      // Execute
      await userController.deleteUser(req, res);

      // Assert
      expect(findByIdStub.calledWith('user123')).to.be.true;
      expect(deleteStub.calledWith('user123')).to.be.true;
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.status().json.args[0][0].message).to.include(
        'deleted successfully'
      );
    });

    it('should return 404 if user is not found', async () => {
      // Setup
      req.params = { id: 'nonexistent' };

      // Mock User.findById to return null
      userStub = sinon.stub(User, 'findById').resolves(null);

      // Execute
      await userController.deleteUser(req, res);

      // Assert
      expect(res.status.calledWith(404)).to.be.true;
      expect(res.status().json.args[0][0].message).to.include('not found');
    });

    it('should return 500 if there is a server error', async () => {
      // Setup
      req.params = { id: 'user123' };

      // Mock User.findById to throw an error
      userStub = sinon
        .stub(User, 'findById')
        .throws(new Error('Database error'));

      // Execute
      await userController.deleteUser(req, res);

      // Assert
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.status().json.args[0][0].errorMessage).to.include(
        'Error deleting user'
      );
    });
  });

  describe('6. signinUser', () => {
    it('should sign in user and return token successfully', async () => {
      // Setup
      req.body = { email: 'user@university.edu', password: 'password123' };

      const mockUser = {
        _id: 'user123',
        email: 'user@university.edu',
        password: 'hashedPassword',
        toObject: () => ({
          _id: 'user123',
          email: 'user@university.edu',
          password: 'hashedPassword',
        }),
        save: sinon.stub().resolves(),
      };

      // Mock User.findOne to return a user
      userStub = sinon.stub(User, 'findOne').resolves(mockUser);

      // Mock bcrypt.compare to return true
      bcryptStub = sinon.stub(bcrypt, 'compare').resolves(true);

      // Mock jwt.sign
      const mockToken = 'mockJWTToken';
      jwtStub = sinon.stub(jwt, 'sign').returns(mockToken);

      // Execute
      await userController.signinUser(req, res);

      // Assert
      expect(userStub.calledWith({ email: 'user@university.edu' })).to.be.true;
      expect(bcryptStub.calledWith('password123', 'hashedPassword')).to.be.true;
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.status().json.args[0][0].token).to.equal(mockToken);
      expect(res.status().json.args[0][0].message).to.include(
        'signed in successfully'
      );
    });

    it('should return 400 if email or password is missing', async () => {
      // Setup - missing email
      req.body = { password: 'password123' };

      // Execute
      await userController.signinUser(req, res);

      // Assert
      expect(res.status.calledWith(400)).to.be.true;
      expect(res.status().json.args[0][0].errorMessage).to.include(
        'Email and password are required'
      );

      // Reset
      res.status = sinon.stub().returns({ json: sinon.spy() });

      // Setup - missing password
      req.body = { email: 'user@university.edu' };

      // Execute
      await userController.signinUser(req, res);

      // Assert
      expect(res.status.calledWith(400)).to.be.true;
      expect(res.status().json.args[0][0].errorMessage).to.include(
        'Email and password are required'
      );
    });

    it('should return 401 if user is not found', async () => {
      // Setup
      req.body = {
        email: 'nonexistent@university.edu',
        password: 'password123',
      };

      // Mock User.findOne to return null
      userStub = sinon.stub(User, 'findOne').resolves(null);

      // Execute
      await userController.signinUser(req, res);

      // Assert
      expect(res.status.calledWith(401)).to.be.true;
      expect(res.status().json.args[0][0].errorMessage).to.include(
        'Invalid email or password'
      );
    });

    it('should return 401 if password is incorrect', async () => {
      // Setup
      req.body = { email: 'user@university.edu', password: 'wrongpassword' };

      const mockUser = {
        _id: 'user123',
        email: 'user@university.edu',
        password: 'hashedPassword',
      };

      // Mock User.findOne to return a user
      userStub = sinon.stub(User, 'findOne').resolves(mockUser);

      // Mock bcrypt.compare to return false
      bcryptStub = sinon.stub(bcrypt, 'compare').resolves(false);

      // Execute
      await userController.signinUser(req, res);

      // Assert
      expect(res.status.calledWith(401)).to.be.true;
      expect(res.status().json.args[0][0].errorMessage).to.include(
        'Invalid email or password'
      );
    });

    it('should reuse existing valid token if available', async () => {
      // Setup
      req.body = { email: 'user@university.edu', password: 'password123' };

      const mockToken = 'existingValidToken';
      const mockUser = {
        _id: 'user123',
        email: 'user@university.edu',
        password: 'hashedPassword',
        token: mockToken,
        toObject: () => ({
          _id: 'user123',
          email: 'user@university.edu',
          password: 'hashedPassword',
          token: mockToken,
        }),
        save: sinon.stub().resolves(),
      };

      // Mock User.findOne to return a user with token
      userStub = sinon.stub(User, 'findOne').resolves(mockUser);

      // Mock bcrypt.compare to return true
      bcryptStub = sinon.stub(bcrypt, 'compare').resolves(true);

      // Mock jwt.verify to validate token
      const jwtVerifyStub = sinon
        .stub(jwt, 'verify')
        .returns({ userId: 'user123' });

      // Execute
      await userController.signinUser(req, res);

      // Assert
      expect(jwtVerifyStub.called).to.be.true;
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.status().json.args[0][0].token).to.equal(mockToken);
    });

    it('should return 500 if there is a server error', async () => {
      // Setup
      req.body = { email: 'user@university.edu', password: 'password123' };

      // Mock User.findOne to throw an error
      userStub = sinon
        .stub(User, 'findOne')
        .throws(new Error('Database error'));

      // Execute
      await userController.signinUser(req, res);

      // Assert
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.status().json.args[0][0].errorMessage).to.include(
        'Error signing in user'
      );
    });
  });

  describe('7. signoutUser', () => {
    it('should sign out user successfully', async () => {
      // Setup
      req.user = { _id: 'user123' };

      const mockUser = {
        _id: 'user123',
        email: 'user@university.edu',
        token: 'someToken',
        save: sinon.stub().resolves(),
      };

      // Mock User.findById to return a user
      userStub = sinon.stub(User, 'findById').resolves(mockUser);

      // Execute
      await userController.signoutUser(req, res);

      // Assert
      expect(userStub.calledWith('user123')).to.be.true;
      expect(mockUser.token).to.be.null;
      expect(mockUser.save.called).to.be.true;
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.status().json.args[0][0].message).to.include(
        'signed out successfully'
      );
    });

    it('should return 404 if user is not found', async () => {
      // Setup
      req.user = { _id: 'nonexistent' };

      // Mock User.findById to return null
      userStub = sinon.stub(User, 'findById').resolves(null);

      // Execute
      await userController.signoutUser(req, res);

      // Assert
      expect(res.status.calledWith(404)).to.be.true;
      expect(res.status().json.args[0][0].message).to.include('not found');
    });

    it('should return 500 if there is a server error', async () => {
      // Setup
      req.user = { _id: 'user123' };

      // Mock User.findById to throw an error
      userStub = sinon
        .stub(User, 'findById')
        .throws(new Error('Database error'));

      // Execute
      await userController.signoutUser(req, res);

      // Assert
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.status().json.args[0][0].errorMessage).to.include(
        'Error signing out user'
      );
    });
  });
});
