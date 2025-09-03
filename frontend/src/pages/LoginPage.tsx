import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import { login, registerUser } from "../services/authService.ts";
import {
  errorClass,
  h2Class,
  inputClass,
  inputForm,
  linkClass,
  submitClass
} from "./LoginPageStyles.ts";
import { useState } from "react";
import SuccessToast2 from "../components/Toast.tsx";
import {useDispatch} from "react-redux";

export interface LoginFormData {
  email: string;
  password: string;
  name? : string;
}

type ModeType = 'login' | 'register';

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<LoginFormData>();
  const [mode, setMode] = useState<ModeType>('login');
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onSubmit = async (data: LoginFormData) => {
    setShowSuccessToast(false);
    if (mode === 'login') {
      try {
        const response = await login(data, dispatch);
        console.log("Access granted! Token:", response.access_token);
        navigate('/');
      } catch (error: any) {
        console.error("Auth error:", error.message);
        alert(error.message);
      }
    } else {
      try {
        const response = await registerUser(data);
        if (response.includes('Account with email')) {
          console.log("Registered:", response);
          setShowSuccessToast(true);
        }
        navigate('/login');
      } catch (error: any) {
        console.error("Auth error:", error.message);
        alert(error.message);
      }
    }
  };

  return (
    <>
      <div className={inputForm}>
        <h2 className={h2Class}>Login Form</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col items-center justify-between my-4">
            <label htmlFor="email" className="self-start text-sm">E-mail</label>
            <input
              id="email"
              className={inputClass}
              {...register('email', {
                required: "E-mail is required field",
                pattern: {
                  value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                  message: 'Enter a valid email address',
                }
              })}
            />
            {errors.email && <span className={errorClass}>{errors.email.message as string}</span>}
          </div>
          <div className="flex flex-col items-center justify-between my-4">
            <label htmlFor="password" className="self-start text-sm">Password</label>
            <input
              type="password"
              id="password"
              className={inputClass}
              {...register("password", {
                required: "Password is required field",
                minLength: {
                  value: 6,
                  message: "Пароль має бути не менше 6 символів.",
                },
              })}
            />
            {errors.password && <span className={errorClass}>{errors.password.message as string}</span>}
          </div>
          { mode === 'register' && (
            <>
            <div className="flex flex-col items-center justify-between my-4">
              <label htmlFor="password" className="self-start text-sm">Repeat password</label>
              <input
                type="password"
                id="passwordConfirm"
                className={inputClass}
                {...register("password", {
                  required: "Password is required field",
                  minLength: {
                    value: 6,
                    message: "Пароль має бути не менше 6 символів.",
                  },
                  validate: (value) => value === getValues("password") || "Паролі не співпадають",
                })}
              />
              {errors.password && <span className={errorClass}>{errors.password.message as string}</span>}
            </div>
              <div className="flex flex-col items-center justify-between my-4">
                <label htmlFor="password" className="self-start text-sm">Name or Nick (optional)</label>
                <input
                  type="text"
                  id="user-name"
                  className={inputClass}
                />
              </div>
            </>
          )}
          <input type="submit"
                 className={submitClass}
                 value="Submit"
          />
        </form>
        { mode === 'login' && (
          <div className={linkClass}>
            <span>Have no account yet?</span>
            <span>
              Click
              <span className="text-blue-500 underline" onClick={() => setMode('register')}> here </span>
              to register
            </span>
          </div>
        )}
        { mode === 'register' && (
          <div className={linkClass}>
            <span>Are you registered yet?</span>
            <span>
              Click
              <span className="text-blue-500 underline" onClick={() => setMode('login')}> here </span>
              to login
            </span>
          </div>
        )}
      </div>
      {showSuccessToast && <SuccessToast2 />}
    </>
  );
}

export default LoginPage;
