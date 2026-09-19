import type { AuthUser } from '../context/AuthContext';
import type { ApiAuthUser } from '../api/authApi';

export function normalizeUser(apiUser: ApiAuthUser): AuthUser {
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
    role: apiUser.role,
    profile_completed: apiUser.profile_completed,
    status: (apiUser.status as AuthUser['status']) ?? null,
  };
}