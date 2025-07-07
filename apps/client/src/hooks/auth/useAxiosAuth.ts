import { useEffect } from "react";
import { logout } from "@client/redux/features/userSlice";
import { setAxiosAuthHandler } from "@client/configs/axios";
import { useAppDispatch } from "../commonHooks/useAppDispatch";
import { useNavigate } from "react-router-dom";

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
