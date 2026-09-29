import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../services/firebase";
import { isUserAdmin } from "../services/admins";
import { getCustomerProfile } from "../services/customers";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [customerProfile, setCustomerProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const [adminStatus, profile] = await Promise.all([
          isUserAdmin(user.email),
          getCustomerProfile(user.uid),
        ]);
        setIsAdmin(adminStatus);
        setCustomerProfile(profile);
      } else {
        setIsAdmin(false);
        setCustomerProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  async function refreshProfile() {
    if (currentUser) {
      const profile = await getCustomerProfile(currentUser.uid);
      setCustomerProfile(profile);
    }
  }

  const logout = () => signOut(auth);

  const value = { currentUser, isAdmin, customerProfile, loading, logout, refreshProfile };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}