import type { AuthUser } from '../context/AuthContext';

export function normalizeUser(apiUser: {
  id?: string;
  _id?: string;
  email: string;
  first_name?: string;
  last_name?: string;
  name?: string;
  role: number;
  profile_completed?: boolean;
}): AuthUser {
  const id = apiUser.id ?? apiUser._id;

  if (!id) {
    throw new Error('normalizeUser: API user is missing both id and _id');
  }

  return {
    id,
    _id: apiUser._id,
    email: apiUser.email,
    first_name: apiUser.first_name,
    last_name: apiUser.last_name,
    name: apiUser.name,
    role: apiUser.role,
    profileComplete: apiUser.profile_completed,
  };
}