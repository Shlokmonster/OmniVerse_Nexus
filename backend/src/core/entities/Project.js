export class Project {
  constructor({ id, name, description, status, organizationId, createdAt, updatedAt }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.status = status || 'Active'; // Active, Warning, Degraded, Inactive
    this.organizationId = organizationId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
