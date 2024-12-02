export enum UserRole {
  ADMIN = 'admin',
  MEMBER = 'member',
  VISITOR = 'visitor',
}

export enum Permission {
  WRITE = 'write',
  READ = 'read',
  EXPORT = 'export',
  ALL = 'all',
}

export enum Resource {
  USERS = 'users',
  TASKS = 'tasks',
  TEAMS = 'teams',
  PROJECTS = 'projects',
}

export enum Priority {
  MAXIMUM = 'maximum',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
  NONE = 'none',
}
