import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../../../infrastructure/config/env.js';

export class LoginUseCase {
  constructor(prismaClient) {
    this.prisma = prismaClient;
  }

  async execute({ email, password }) {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    const dbUser = await this.prisma.user.findUnique({
      where: { email },
      include: { role: true, organization: true }
    });

    if (!dbUser) {
      throw new Error('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, dbUser.passwordHash);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: dbUser.id,
        email: dbUser.email,
        role: dbUser.role.name,
        permissions: dbUser.role.permissions,
        organizationId: dbUser.organizationId
      },
      env.jwtSecret,
      { expiresIn: '24h' }
    );

    // Create Audit Log
    await this.prisma.auditLog.create({
      data: {
        userId: dbUser.id,
        action: 'USER_LOGIN',
        details: `User authenticated from client.`
      }
    });

    return {
      token,
      user: {
        id: dbUser.id,
        email: dbUser.email,
        name: dbUser.name,
        role: dbUser.role.name,
        permissions: dbUser.role.permissions,
        organization: dbUser.organization ? dbUser.organization.name : null
      }
    };
  }
}
