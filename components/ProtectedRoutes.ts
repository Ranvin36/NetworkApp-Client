import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { router } from 'expo-router';
import { rootStore } from "@/app/redux/store";

function ProtectedRoutes({ children }) {
  const user = useSelector((state: rootStore) => state.user.user);

  useEffect(() => {
    console.log("EFFECT ")
    if (!user || user.token.length >= 2) {
      router.push("home");
    }
  }, [user]);

  if (!user || user.token.length <= 2) {
    return null; // Or a loading spinner
  }

  return children;
}

export default ProtectedRoutes;
