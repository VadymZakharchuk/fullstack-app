import Header from "../home-page/Header.tsx";

import { useQuery } from "@apollo/client/react";
import { gql } from "@apollo/client";

// Опис GraphQL-запиту
// $userId: Int! означає, що змінна userId повинна бути типу Int і є обов'язковою
const GET_USER_QUERY = gql`
  query GetUser($userId: Int!) {
    user(id: $userId) {
      id
      email
    }
  }
`;

const SettingsPage = () => {
  // Використання хука useQuery для виконання запиту
  // Ми передаємо id=5 як змінну для запиту
  const { data, loading, error } = useQuery(GET_USER_QUERY, {
    variables: { userId: 5 },
  });

  // Виводимо повідомлення, поки дані завантажуються
  if (loading) {
    return (
      <h1 className="text-blue-900">Завантаження даних користувача...</h1>
    );
  }

  // Обробка помилок
  if (error) {
    console.error("Помилка GraphQL-запиту:", error);
    return (
      <>
        <Header />
        <h1 className="text-red-600">
          Помилка завантаження даних користувача: {error.message}
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          Можливо, термін дії вашого токена закінчився.
        </p>
      </>
    );
  }

  // Виведення даних, якщо запит успішний
  return (
    <>
      <Header />
      <h1 className="text-blue-900">Сторінка налаштувань</h1>
      {data && data.user ? (
        <div className="mt-4 p-4 border rounded-lg shadow text-blue-900 w-[60%] mx-auto">
          <h2 className="text-lg font-semibold">Інформація про користувача</h2>
          <p><strong>ID:</strong> {data.user.id}</p>
          <p><strong>Email:</strong> {data.user.email}</p>
        </div>
      ) : (
        <p className="mt-4 text-gray-600">Користувача з ID 5 не знайдено.</p>
      )}
    </>
  );
};

export default SettingsPage;
