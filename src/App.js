import './App.css';
import Invoice from "./Invoice";
import InvoiceList from "./InvoiceList";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { SnackbarProvider } from 'notistack';

const RootLayout = () => (
  <div>
    <Outlet />
  </div>
);

export const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <Invoice />
      },
      {
        path: "/invoice",
        element: <InvoiceList />
      }
    ]
  }
]);

function App() {
  return (
    <SnackbarProvider maxSnack={3}>
      <RouterProvider router={appRouter} />
    </SnackbarProvider>
  );
}

export default App;
