export const ROLES = {
  ADMIN: 'ADMIN',
  RECRUITER: 'RECRUITER',
  SEEKER: 'SEEKER'
};

export const hasRole = (user, role) => {
  return user && user.roles && user.roles.includes(role);
};

export const isRecruiter = (user) => hasRole(user, ROLES.RECRUITER);
export const isSeeker = (user) => hasRole(user, ROLES.SEEKER);
export const isAdmin = (user) => hasRole(user, ROLES.ADMIN);