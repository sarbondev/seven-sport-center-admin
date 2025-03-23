import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import { Admins } from "./pages/Admins";
import { useDispatch, useSelector } from "react-redux";
import { Axios } from "./middlewares/Axios";
import { setError, setPending, setUser } from "./Slicers/UserSlicer";
import { useEffect, useMemo } from "react";
import { RootState } from "./Store/indexStore";
import { Loading } from "./pages/Loading";
import { Login } from "./pages/Login";
import { Error } from "./pages/Error";
import { Trainers } from "./pages/Trainers";
import { Blogs } from "./pages/Blogs";

function App() {
  const { isPending, isAuth } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    async function getMyData() {
      try {
        dispatch(setPending());
        const response = await Axios.get("admin/profile");
        if (!response.data.message) {
          dispatch(setUser(response.data));
        } else {
          dispatch(setError(response.data.message));
        }
      } catch (error: any) {
        dispatch(setError(error.response?.data || "Unknown Token"));
      }
    }
    getMyData();
  }, [dispatch]);

  const router = useMemo(() => {
    if (isPending) {
      return createBrowserRouter([
        {
          path: "/",
          element: <Loading />,
        },
      ]);
    }
    if (isAuth) {
      return createBrowserRouter([
        {
          path: "/",
          element: <RootLayout />,
          children: [
            {
              index: true,
              element: <Admins />,
            },
            {
              path: "trainers",
              element: <Trainers />,
            },
            {
              path: "blogs",
              element: <Blogs />,
            },
            {
              path: "*",
              element: <Error />,
            },
          ],
        },
      ]);
    } else {
      return createBrowserRouter([
        {
          path: "/",
          element: <Login />,
        },
        {
          path: "*",
          element: <Error />,
        },
      ]);
    }
  }, [isAuth, isPending]);

  return <RouterProvider router={router} />;
}

export default App;
