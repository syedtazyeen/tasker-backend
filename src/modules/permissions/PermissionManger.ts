import { Permission, Resource, UserRole } from '@/src/common/enums';
import { RolePermissions } from '@/src/lib/permissions';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PermissionManager {
  /**
   * Checks if a user role has the specified permission on a resource.
   * @param role - The user's role (e.g., ADMIN, MEMBER).
   * @param resource - The resource to check permissions for (e.g., TASKS, PROJECTS).
   * @param permission - The permission to check (e.g., READ, WRITE).
   * @returns true if the role has the permission on the resource, false otherwise.
   */
  hasPermission(
    role: UserRole,
    resource: Resource,
    permission: Permission,
  ): boolean {
    const roleResourcePermissions = RolePermissions[role]?.[resource];
    if (!roleResourcePermissions) {
      return false; // No permissions found for the resource
    }

    return (
      roleResourcePermissions.includes(permission) ||
      roleResourcePermissions.includes(Permission.ALL)
    );
  }
}
