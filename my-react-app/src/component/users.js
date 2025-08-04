const users = {
  'admin': { password: 'admin123', role: 'Administrateur', permissions: ['read', 'write', 'delete', 'export'] },
  'geomaticien': { password: 'geo123', role: 'Géomaticien', permissions: ['read', 'write', 'export'] },
  'consultant': { password: 'cons123', role: 'Consultant', permissions: ['read'] }
};

export default users;