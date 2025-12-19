import type { RootState, AppDispatch } from "src/store";
import type { ILoginFormValues } from "src/types/login";

import { useDispatch, useSelector } from "react-redux";
import React, { memo, useState, useEffect, useCallback } from "react";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { Button, CircularProgress } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";

import { login } from "src/store/actions/authActions";
import { enqueueSnackbar } from "src/store/slices/snackbar";

import { Iconify } from "src/components/iconify";

// ----------------------------------------------------------------------

const SignInView = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading } = useSelector((state: RootState) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  const defaultFormValues: ILoginFormValues = {
    phoneNumber: "+998",
    password: "",
  };

  const [formValues, setFormValues] =
    useState<ILoginFormValues>(defaultFormValues);

  const [phoneError, setPhoneError] = useState(false);
  const [phoneHelper, setPhoneHelper] = useState("");

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;

    // Har doim +998 bilan boshlanishini ta'minlaymiz
    if (!input.startsWith("+998")) return;

    const formatted = input.replace(/[^\d+]/g, ""); // Raqamdan boshqa belgilarni olib tashlash

    // Maksimal uzunlikni cheklaymiz
    if (formatted.length > 13) return;

    console.log("formatted", formatted);

    setFormValues((prev) => ({
      ...prev,
      phoneNumber: formatted,
    }));
  };

  const handlePasswordChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value } = e.target;

    setFormValues((prev) => ({
      ...prev,
      password: value,
    }));
  };

  useEffect(() => {
    const phone = formValues.phoneNumber;

    if (/^\+998\d{9}$/.test(phone)) {
      setPhoneError(false);
      setPhoneHelper("");
    } else {
      setPhoneError(false);
      setPhoneHelper("");
    }
  }, [formValues.phoneNumber]);

  const handlePhoneBlur = () => {
    const phone = formValues.phoneNumber;
    if (!/^\+998\d{9}$/.test(phone)) {
      setPhoneError(true);
      setPhoneHelper("Telefon raqam to‘liq va +998 bilan boshlanishi kerak");
    }
  };

  const onSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (formValues.password.length < 4 || formValues.password.length === 0) {
        dispatch(
          enqueueSnackbar({
            message: "Parol juda qisqa",
            options: { variant: "error" },
          })
        );
      } else {
        dispatch(login(formValues));
      }
    },
    [dispatch, formValues]
  );

  const renderForm = (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="flex-end"
      component="form"
      noValidate
      onSubmit={onSubmit}
    >
      <TextField
        value={formValues.phoneNumber}
        onChange={handlePhoneChange}
        onBlur={handlePhoneBlur}
        fullWidth
        required
        margin="dense"
        id="phoneNumber"
        autoComplete="phoneNumber"
        name="phoneNumber"
        label="Telefon raqam"
        error={phoneError}
        helperText={phoneHelper}
        InputLabelProps={{ shrink: true }}
        sx={{ mb: 3 }}
      />

      <TextField
        value={formValues.password}
        onChange={handlePasswordChange}
        fullWidth
        required
        id="password"
        autoComplete="current-password"
        name="password"
        label="Parol"
        InputLabelProps={{ shrink: true }}
        type={showPassword ? "text" : "password"}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
              >
                <Iconify
                  icon={
                    showPassword ? "solar:eye-bold" : "solar:eye-closed-bold"
                  }
                />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{ mb: 3 }}
      />

      {isLoading ? (
        <Button
          type="button"
          fullWidth
          disabled
          size="large"
          color="inherit"
          variant="contained"
          sx={{ mt: 3, mb: 2, gap: 2, mx: "auto" }}
        >
          <CircularProgress size={20} />
          Tekshirilmoqda...
        </Button>
      ) : (
        <Button
          type="submit"
          fullWidth
          size="large"
          color="inherit"
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Kirish
        </Button>
      )}
    </Box>
  );

  return (
    <>
      <Box
        gap={1.5}
        display="flex"
        flexDirection="column"
        alignItems="center"
        sx={{ mb: 5 }}
      >
        <Typography variant="h5">Tizimga kirish</Typography>
      </Box>

      {renderForm}
      <Box
        sx={{
          mt: 3,
          p: 2,
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
          textAlign: 'center',
        }}
      >
        <Typography variant="body2" sx={{ mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
          🔐 Default kirish ma&apos;lumotlari
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Box sx={{ px: 2, py: 0.5, borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="body2">+998901234567</Typography>
          </Box>
          <Box sx={{ px: 2, py: 0.5, borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="body2">admin123</Typography>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default memo(SignInView);
