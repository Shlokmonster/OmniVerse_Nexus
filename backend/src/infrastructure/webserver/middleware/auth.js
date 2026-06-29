import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';

export const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Access denied. No token provided.'
    });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    req.user = decoded; // { userId, email, role, permissions, organizationId }
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired token.'
    });
  }
};

export const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized'
      });
    }

    const { permissions } = req.user;
    const hasPermission = permissions.includes('*') || permissions.includes(permission);

    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        error: `Forbidden. Missing permission: ${permission}`
      });
    }

    next();
  };
};
