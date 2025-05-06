import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/domain/enterprise/types/user';

export type RolesType = {
  roles: UserRole[];
  isAll?: boolean;
};

export const ROLES = 'ROLES';

export const Roles = ({ roles, isAll = true }: RolesType) => {
  return SetMetadata(ROLES, { roles, isAll });
};
