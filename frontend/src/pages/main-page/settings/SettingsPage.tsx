import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useSelector } from 'react-redux';
import Header from "../../home-page/Header.tsx";
import type {RootState} from "../../../store";
import CategoryCard from "./CategoryCard.tsx";

const GET_USER_CATEGORIES = gql`
  query GetUserCategories {
    categories {
      name
      keywords
    }
  }
`;
interface GetCategoryQueryData {
  categories: {
    name: string;
    keywords: string[];
  }[] | null;
}

const SettingsPage = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const { data, loading, error } = useQuery<GetCategoryQueryData>(GET_USER_CATEGORIES);

  if (loading) {
    return (
      <h1 className="text-blue-900">Завантаження списку категорій користувача...</h1>
    );
  }

  if (error) {
    console.error("Помилка GraphQL-запиту:", error);
    return (
      <>
        <Header />
        <h1 className="text-red-600">
          Помилка завантаження категорій користувача: {error.message}
        </h1>
      </>
    );
  }
  return (
    <div className="p-4 bg-gray-100 rounded-lg text-balancio">
      <h2 className="text-2xl font-bold">Settings Page</h2>
      <p className="mt-2">Тут буде SettingsPage.</p>
      {user ? (
        <div className="mt-4 p-4 border rounded-lg shadow text-blue-900 w-[60%] mx-auto">
          <h2 className="text-lg font-semibold">Інформація про користувача</h2>
          <p><strong>ID:</strong> {user.id}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
      ) : (
        <p className="mt-4 text-gray-600">Відсутні дані про активного користувача</p>
      )}
      {data && data.categories && data.categories.length > 0 ? (
        <div className="mt-4 p-4 border rounded-lg shadow text-blue-900 w-[60%] mx-auto">
          { data.categories.map((category) => {
            return (
              <CategoryCard name={category.name} keywords={category.keywords} />
            )
          })}
        </div>
        ) : (
        <p className="mt-4 text-gray-600">Відсутні дані про активного користувача</p>
      )}
    </div>
  );
};
export default SettingsPage;
