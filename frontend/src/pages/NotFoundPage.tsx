import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold text-gray-800">404</h1>
      <p className="mt-4 text-xl text-gray-600">На жаль, сторінка, яку ви шукаєте, не існує.</p>
      <Link to="/main" className="mt-6 text-lg text-blue-600 hover:underline">
        Повернутися на головну
      </Link>
    </div>
  );
};

export default NotFoundPage;
