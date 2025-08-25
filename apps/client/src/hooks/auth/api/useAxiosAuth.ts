import { useEffect } from "react";
import { setAxiosAuthHandler } from "@client/configs/axios";
import { useNavigate } from "react-router-dom";
import { logout } from "@client/redux/features/userSlices/authSlices/userSlice";
import { useAppDispatch } from "@client/hooks/commonHooks/useAppDispatch";

export const useAxiosAuth = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    setAxiosAuthHandler(() => {
      dispatch(logout());
      navigate("/login");
    });
  }, [dispatch, navigate]);
};
