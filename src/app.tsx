/* eslint-disable react-hooks/exhaustive-deps */
import "src/global.css";

import type { TypedUseSelectorHook } from "react-redux";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Router } from "src/routes/sections";

import { useScrollToTop } from "src/hooks/use-scroll-to-top";

import Loader from "./components/loader/Loader";
import Snackbar from "./components/snackbar/Snankbar";
import { refreshProfile } from "./store/actions/authActions";

import type { RootState, AppDispatch } from "./store";

const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

export default function App() {
  useScrollToTop();
  const dispatch = useDispatch<AppDispatch>();

  const { isLoadingRefresh } = useTypedSelector((state) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    // Faqat token mavjud bo'lsa va sahifa birinchi marta ochilganda refresh qilish
    if (token) {
      dispatch(refreshProfile());
    }
  }, []);

  if (isLoadingRefresh) {
    return <Loader />;
  }

  return (
    <>
      <Router />
      <Snackbar />
    </>
  );
}
