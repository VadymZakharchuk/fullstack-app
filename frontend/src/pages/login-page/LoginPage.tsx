import { useForm } from "react-hook-form";
import {useLocation, useNavigate} from 'react-router-dom';
import { login, registerUser } from "../../services/authService.ts";
import {
  errorClass,
  h2Class,
  inputClass,
  inputForm,
  linkClass,
  submitClass
} from "./LoginPageStyles.ts";
import {useEffect, useState} from "react";
import SuccessToast2 from "../../components/Toast.tsx";
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

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (location.pathname.includes('login')) {
      setMode('login');
    }
    else {
      setMode('register');
    }
  }, [location.pathname, navigate]);

  const onSubmit = async (data: LoginFormData) => {
    setShowSuccessToast(false);
    if (mode === 'login') {
      try {
        await login(data, dispatch);
        navigate('/main');
      } catch (error) {
        const authError = error as Error;
        console.error("Auth error:", authError.message);
        alert(authError.message);
      }
    } else {
      try {
        const response = await registerUser(data);
        if (response.includes('Account with email')) {
          setShowSuccessToast(true);
        }
        navigate('/login');
      } catch (error) {
        const authError = error as Error;
        console.error("Auth error:", authError.message);
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
                required: "Поле E-mail є обов'язковим",
                pattern: {
                  value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                  message: 'ВВедіть коректну EMail адресу',
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
                required: "Поле пароль є обов'язковим",
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
                  required: "Поле пароль є обов'язковим",
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
