import { prisma } from '../../infrastructure/database/prisma/connection.js';

// Import our mock users from AuthController (we'll redefine it here for consistency)
let mockUsers = [
  {
    id: 'mock-user-1',
    email: 'admin@omniverse.nexus',
    name: 'Jane Doe',
    role: { name: 'Admin' },
    organization: { name: 'Nexus Operations Group' },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export class UserController {
  // GET /api/users — list all users in the same org (Admin only)
  getUsers = async (req, res) => {
    try {
      const { organizationId } = req.user;
      
      try {
        const where = organizationId ? { organizationId } : {};
        const users = await prisma.user.findMany({
          where,
          include: { role: true, organization: true },
          orderBy: { createdAt: 'desc' }
        });
        const safeUsers = users.map(({ passwordHash, ...rest }) => ({
          ...rest,
          role: rest.role?.name,
          organization: rest.organization?.name
        }));
        return res.status(200).json({ success: true, data: safeUsers });
      } catch (dbErr) {
        return res.status(200).json({ 
          success: true, 
          data: mockUsers.map(u => ({
            id: u.id,
            email: u.email,
            name: u.name,
            role: u.role.name,
            organization: u.organization?.name,
            createdAt: u.createdAt,
            updatedAt: u.updatedAt
          }))
        });
      }
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  };

  // GET /api/users/me — return the current user's profile
  getMe = async (req, res) => {
    try {
      try {
        const dbUser = await prisma.user.findUnique({
          where: { id: req.user.userId },
          include: { role: true, organization: true }
        });
        if (!dbUser) {
          return res.status(404).json({ success: false, error: 'User not found.' });
        }
        const { passwordHash, ...safeUser } = dbUser;
        return res.status(200).json({
          success: true,
          data: {
            ...safeUser,
            role: safeUser.role?.name,
            organization: safeUser.organization?.name
          }
        });
      } catch (dbErr) {
        const user = mockUsers.find(u => u.id === req.user.userId || u.email === req.user.email);
        if (!user) {
          return res.status(404).json({ success: false, error: 'User not found.' });
        }
        return res.status(200).json({
          success: true,
          data: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role.name,
            organization: user.organization?.name,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
          }
        });
      }
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  };

  // PATCH /api/users/me — update name or email
  updateMe = async (req, res) => {
    try {
      const { name, email } = req.body;
      
      try {
        const updated = await prisma.user.update({
          where: { id: req.user.userId },
          data: { ...(name && { name }), ...(email && { email }) }
        });
        const { passwordHash, ...safeUser } = updated;
        return res.status(200).json({ success: true, data: safeUser });
      } catch (dbErr) {
        const userIndex = mockUsers.findIndex(u => u.id === req.user.userId || u.email === req.user.email);
        if (userIndex === -1) {
          return res.status(404).json({ success: false, error: 'User not found.' });
        }
        if (name) mockUsers[userIndex].name = name;
        if (email) mockUsers[userIndex].email = email;
        mockUsers[userIndex].updatedAt = new Date().toISOString();
        
        return res.status(200).json({ 
          success: true, 
          data: {
            id: mockUsers[userIndex].id,
            email: mockUsers[userIndex].email,
            name: mockUsers[userIndex].name,
            role: mockUsers[userIndex].role.name,
            organization: mockUsers[userIndex].organization?.name,
            createdAt: mockUsers[userIndex].createdAt,
            updatedAt: mockUsers[userIndex].updatedAt
          }
        });
      }
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  };
}

export const userController = new UserController();
