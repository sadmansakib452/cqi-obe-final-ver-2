'use client'
// File: /contexts/UserContext.jsx

import React, { createContext } from 'react';
import { useSession } from 'next-auth/react';

export const UserContext = createContext();

/**
 * UserProvider component that provides userRole and userEmail to the application.
 *
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components.
 * @returns {JSX.Element} - The UserContext provider.
 */
const UserProvider = ({ children }) => {
  const { data: session, status } = useSession();

  const userRole = session?.user?.role || 'guest'; // Default to 'guest' if role not defined
  const userEmail = session?.user?.email || '';

  return (
    <UserContext.Provider value={{ userRole, userEmail, session, status }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
