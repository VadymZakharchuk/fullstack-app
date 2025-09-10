import { RouterProvider } from 'react-router-dom';
import { useSelector } from "react-redux";
import { useEffect } from "react";
import type { RootState } from "./store";
import { router } from "./router/routes.tsx";

function App() {
  const { isAuth, token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    console.log("App mounted. Auth status:", isAuth, "Token present:", !!token);
  }, [isAuth, token]);

  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
