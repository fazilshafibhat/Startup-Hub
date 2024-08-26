import { UserRole } from "../models/user.schema";

export interface UserDto {
  _id: string;
  email: string;
  password: string;
  roles?: string[];
  // roles: UserRole[];
}
