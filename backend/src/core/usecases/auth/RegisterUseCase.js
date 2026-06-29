import bcrypt from 'bcryptjs';
import { User } from '../../entities/User.js';

export class RegisterUseCase {
  constructor(prismaClient) {
    this.prisma = prismaClient;
  }

  async execute({ email, password, name, organizationName, roleName }) {
    if (!email || !password || !name) {
      throw new Error('Email, password, and name are required');
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Find or create role
    let role = await this.prisma.role.findUnique({
      where: { name: roleName || 'Operator' }
    });

    if (!role) {
      role = await this.prisma.role.create({
        data: {
          name: roleName || 'Operator',
          permissions: roleName === 'Admin' ? ['*'] : ['read:all', 'write:simulation']
        }
      });
    }

    // Find or create organization
    let organization = null;
    if (organizationName) {
      organization = await this.prisma.organization.findUnique({
        where: { name: organizationName }
      });

      if (!organization) {
        organization = await this.prisma.organization.create({
          data: { name: organizationName }
        });
      }
    }

    // Create user in DB
    const dbUser = await this.prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        roleId: role.id,
        organizationId: organization ? organization.id : null
      }
    });

    return new User({
      id: dbUser.id,
      email: dbUser.email,
      name: dbUser.name,
      roleId: dbUser.roleId,
      organizationId: dbUser.organizationId,
      createdAt: dbUser.createdAt,
      updatedAt: dbUser.updatedAt
    });
  }
}
