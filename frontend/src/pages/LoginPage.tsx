import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import {login} from "../services/authService.ts";

export interface LoginFormData {
  email: string;
  password: string;
}

export const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const navigate = useNavigate();
  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await login(data);
      console.log("Access granted! Token:", response.access_token);
      localStorage.setItem('access_token', response.access_token);
      navigate('/');
    } catch (error: any) {
      console.error("Auth error:", error.message);
      alert(error.message);
    }
  };
  const inputForm = 'mx-auto h-fit p-4 my-4 w-[340px] flex flex-col items-center justify-center bg-gray-200 ' +
    'text-base text-gray-600 font-semibold rounded-md';

  return (
    <>
      <div className={inputForm}>
        <h2 className="text-[24px] font-bold text-blue-500">Login Form</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col items-center justify-between my-4">
            <label htmlFor="email" className="self-start text-sm">E-mail</label>
            <input
              id="email"
              className="mt-2 p-2 rounded-md border border-gray-400 border-solid w-[260px]"
              {...register('email', {
                required: "E-mail is required field",
                pattern: {
                  value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                  message: 'Enter a valid email address',
                }
              })}
            />
            {errors.email && <span className="text-red-400 text-xs self-start">{errors.email.message as string}</span>}
          </div>
          <div className="flex flex-col items-center justify-between my-4">
            <label htmlFor="password" className="self-start text-sm">Password</label>
            <input
              type="password"
              id="password"
              className="mt-2 p-2 rounded-md border border-gray-400 border-solid w-[260px]"
              {...register("password", {
                required: "Password is required field",
                minLength: {
                  value: 6,
                  message: "Пароль має бути не менше 6 символів.",
                },
              })}
            />
            {errors.password && <span className="text-red-400 text-xs self-start">{errors.password.message as string}</span>}
          </div>

          <input type="submit"
                 className="my-2 p-2 w-[260px] bg-blue-400 rounded-lg text-white font-semibold"
                 value="Submit"
          />
        </form>
      </div>
    </>
  );
}

