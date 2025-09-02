import React from 'react';

const LoginPage: React.FC = () => {
  return (
    <div>
      <h1>Вхід</h1>
      <form>
        <div>
          <label htmlFor="email">Електронна пошта:</label>
          <input type="email" id="email" />
        </div>
        <div>
          <label htmlFor="password">Пароль:</label>
          <input type="password" id="password" />
        </div>
        <button type="submit">Увійти</button>
      </form>
    </div>
  );
};

export default LoginPage;