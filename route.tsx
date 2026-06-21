import App from "@/App";
import { MainLayout } from "@/components/layout/MainLayout";
import { Timer } from "@/components/Timer";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
    {
        element: <MainLayout />,
        children: [
            { path: "/", element: <App /> },
        ],
    },
])