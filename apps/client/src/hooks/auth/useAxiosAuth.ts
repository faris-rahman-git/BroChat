import { useEffect } from "react";
import { setAxiosAuthHandler } from "@client/configs/axios";
import { useAppDispatch } from "../commonHooks/useAppDispatch";
import { useNavigate } from "react-router-dom";
import { logout } from "@client/redux/features/userSlices/authSlices/userSlice";

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
