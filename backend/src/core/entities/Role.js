export class Role {
  constructor({ id, name, permissions }) {
    this.id = id;
    this.name = name; // Admin, Operator, Viewer
    this.permissions = permissions || []; // ['read:all', 'write:simulation', 'execute:scaling']
  }

  hasPermission(permission) {
    if (this.permissions.includes('*')) return true;
    return this.permissions.includes(permission);
  }
}
