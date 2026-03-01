import { useCallback, useEffect, useState } from "react";
import { useActor } from "./useActor";

const SESSION_KEY = "adminSessionToken";

export function useAdminAuth() {
  const { actor, isFetching } = useActor();
  const [sessionToken, setSessionToken] = useState<string | null>(() =>
    sessionStorage.getItem(SESSION_KEY),
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // On mount, verify stored token
  useEffect(() => {
    if (isFetching || !actor) return;

    const storedToken = sessionStorage.getItem(SESSION_KEY);
    if (!storedToken) {
      setIsLoading(false);
      return;
    }

    actor
      .isSessionValid(storedToken)
      .then((valid) => {
        if (!valid) {
          sessionStorage.removeItem(SESSION_KEY);
          setSessionToken(null);
        } else {
          setSessionToken(storedToken);
        }
      })
      .catch(() => {
        sessionStorage.removeItem(SESSION_KEY);
        setSessionToken(null);
      })
      .finally(() => setIsLoading(false));
  }, [actor, isFetching]);

  const login = useCallback(
    async (username: string, password: string) => {
      if (!actor) throw new Error("Actor not ready");
      setIsLoading(true);
      setError(null);
      try {
        const result = await actor.adminLogin(username, password);
        if (result.__kind__ === "ok") {
          sessionStorage.setItem(SESSION_KEY, result.ok);
          setSessionToken(result.ok);
        } else {
          setError(result.err || "Login gagal. Periksa username dan password.");
          throw new Error(result.err);
        }
      } catch (err) {
        const msg =
          err instanceof Error
            ? err.message
            : "Login gagal. Periksa username dan password.";
        setError(msg);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [actor],
  );

  const logout = useCallback(async () => {
    const token = sessionStorage.getItem(SESSION_KEY);
    if (token && actor) {
      try {
        await actor.adminLogout(token);
      } catch {
        // ignore errors during logout
      }
    }
    sessionStorage.removeItem(SESSION_KEY);
    setSessionToken(null);
    setError(null);
  }, [actor]);

  return {
    sessionToken,
    isLoggedIn: !!sessionToken,
    isLoading: isLoading || isFetching,
    error,
    login,
    logout,
    clearError: () => setError(null),
  };
}
