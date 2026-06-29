export class User {
  constructor({ id, email, passwordHash, name, organizationId, roleId, createdAt, updatedAt }) {
    this.id = id;
    this.email = email;
    this.passwordHash = passwordHash;
    this.name = name;
    this.organizationId = organizationId;
    this.roleId = roleId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  validateEmail() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.email);
  }

  toJSON() {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      organizationId: this.organizationId,
      roleId: this.roleId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}
