import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    async function authenticate() {
      setIsLoading(true);
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_SERVER_PATH}/api/v1/auth`,
          {
            withCredentials: true,
          }
        );
        if (data) {
          setIsLoading(false);
          setIsAuth(data.isAuth);
        }
      } catch (error) {
        setIsLoading(false);
        console.log(error.response.data.msg);
      }
    }
    authenticate();
  }, []);

  function login(userdata, auth) {
    setUser(userdata);
    setIsAuth(auth);
  }

  function logout() {
    setUser(null);
    setIsAuth(false);
  }

  return (
    <UserContext.Provider value={{ user, isAuth, login, logout, isLoading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  return useContext(UserContext);
}
