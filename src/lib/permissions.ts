import { Permission, Resource, UserRole } from '../common/enums';

export const RolePermissions = {
  [UserRole.ADMIN]: {
    [Resource.PROJECTS]: [Permission.ALL], // Admin can perform any action on projects
  },
  [UserRole.MEMBER]: {
    [Resource.PROJECTS]: [Permission.READ], // Members can only read projects
  },
  [UserRole.VISITOR]: {
    [Resource.PROJECTS]: [Permission.READ], // Visitors can only read projects
  },
};
