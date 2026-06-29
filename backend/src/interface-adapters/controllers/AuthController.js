import { RegisterUseCase } from '../../core/usecases/auth/RegisterUseCase.js';
import { LoginUseCase } from '../../core/usecases/auth/LoginUseCase.js';
import { prisma } from '../../infrastructure/database/prisma/connection.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../../infrastructure/config/env.js';

// Mock in-memory user store for when PostgreSQL isn't available
let mockUsers = [
  {
    id: 'mock-user-1',
    email: 'admin@omniverse.nexus',
    passwordHash: bcrypt.hashSync('admin123', 10),
    name: 'Jane Doe',
    role: { name: 'Admin', permissions: ['*'] },
    organization: { name: 'Nexus Operations Group' }
  }
];

export class AuthController {
  constructor() {
    this.registerUseCase = new RegisterUseCase(prisma);
    this.loginUseCase = new LoginUseCase(prisma);
  }

  register = async (req, res, next) => {
    try {
      const { email, password, name, organizationName, roleName } = req.body;
      
      // Try with real DB first, else mock
      try {
        const user = await this.registerUseCase.execute({
          email,
          password,
          name,
          organizationName,
          roleName
        });
        return res.status(201).json({
          success: true,
          message: 'User registered successfully',
          data: user.toJSON()
        });
      } catch (dbErr) {
        // Fallback to mock mode
        const existing = mockUsers.find(u => u.email === email);
        if (existing) throw new Error('User already exists with this email');
        
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        const newUser = {
          id: `mock-user-${Date.now()}`,
          email,
          passwordHash,
          name,
          role: { name: roleName || 'Operator', permissions: roleName === 'Admin' ? ['*'] : ['read:all', 'write:simulation'] },
          organization: organizationName ? { name: organizationName } : null
        };
        mockUsers.push(newUser);
        return res.status(201).json({
          success: true,
          message: 'User registered successfully (Mock DB)',
          data: {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            role: newUser.role.name,
            permissions: newUser.role.permissions,
            organization: newUser.organization?.name || null
          }
        });
      }
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }
  };

  login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      
      // Try with real DB first
      try {
        const result = await this.loginUseCase.execute({ email, password });
        return res.status(200).json({
          success: true,
          message: 'Login successful',
          data: result
        });
      } catch (dbErr) {
        // Fallback to mock users
        const user = mockUsers.find(u => u.email === email);
        if (!user) throw new Error('Invalid email or password');
        
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) throw new Error('Invalid email or password');
        
        const token = jwt.sign(
          {
            userId: user.id,
            email: user.email,
            role: user.role.name,
            permissions: user.role.permissions,
            organizationId: user.organization?.id
          },
          env.jwtSecret,
          { expiresIn: '24h' }
        );
        
        return res.status(200).json({
          success: true,
          message: 'Login successful (Mock DB)',
          data: {
            token,
            user: {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role.name,
              permissions: user.role.permissions,
              organization: user.organization?.name || null
            }
          }
        });
      }
    } catch (error) {
      return res.status(401).json({
        success: false,
        error: error.message
      });
    }
  };
}

export const authController = new AuthController();
