import { useState, useEffect } from 'react';

const usePermissions = (userId) => {
  const [permissions, setPermissions] = useState([]);
  useEffect(() => {
    // Placeholder: fetch permissions
    setPermissions(['read', 'write']);
  }, [userId]);
  return permissions;
};

export default usePermissions;
