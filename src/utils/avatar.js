// src/utils/avatar.js
export const getAvatarUrl = (user) => {
  if (!user) {
    return 'https://ui-avatars.com/api/?name=User&background=ccc&color=000';
  }
  
  // If user has custom avatar
  if (user.avatar && user.avatar.startsWith('http')) {
    return user.avatar;
  }
  
  // Generate avatar from name
  const name = user.name || user.email || 'User';
  const encodedName = encodeURIComponent(name);
  
  // Different colors based on role
  const background = 
    user.role === 'admin' ? '8b5cf6' : 
    user.role === 'volunteer' ? 'f59e0b' : 
    'dc2626';
  
  return `https://ui-avatars.com/api/?name=${encodedName}&background=${background}&color=fff&bold=true`;
};