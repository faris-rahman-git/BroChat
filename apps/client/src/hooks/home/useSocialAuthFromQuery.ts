import { setLoading, setUser, logout } from "@client/redux/features/userSlice";
import { useEffect } from "react";
import { useAppDispatch } from "../commonHooks/useAppDispatch";
import { useNavigate } from "react-router-dom";
import { setError } from "@client/redux/features/errorSlice";

function useSocialAuthFromQuery() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userString = params.get("user");
    const errorMessage = params.get("message");

    if (errorMessage) {
      dispatch(setError(decodeURIComponent(errorMessage)));
      dispatch(logout());
      navigate("/login");
      return;
    }

    if (userString) {
      try {
        const user = JSON.parse(decodeURIComponent(userString));
        dispatch(setUser({ user }));
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch (err) {
        console.error("Failed to parse user", err);
        dispatch(setError("Invalid login response."));
        dispatch(logout());
        navigate("/login");
      }
    }

    dispatch(setLoading({ loading: false }));
  }, [dispatch, navigate]);
}

export default useSocialAuthFromQuery;
