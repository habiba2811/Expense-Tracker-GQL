import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import TransactionPage from "./pages/TransactionPage";
import NotFoundPage from "./pages/NotFoundPage";
import Header from "./components/ui/Header";
import { useQuery } from "@apollo/client";
import { GET_AUTHENTICATED_USER } from "./graphql/queries/user.query";
import { Toaster } from "react-hot-toast";
import React, { useEffect } from 'react';
import { useApolloClient } from "@apollo/client";


function App() {
  const { loading, data } = useQuery(GET_AUTHENTICATED_USER);
  const client = useApolloClient();
  useEffect(() => {
    console.log("Loading:", loading);
    console.log("Data:", data);
    console.log("Auth User:", data?.authUser);
  }, [loading, data]);

  useEffect(() => {
    if (!loading && data) {
      client.cache.modify({
        fields: {
          authUser() {
            return data.authUser;
          }
        }
      });
    }
  }, [data, loading, client]);

  if (loading) return <div>Loading...</div>; // Display a loading message or spinner

  const authUser = data?.authUser;

  return (
    <>
      {authUser && <Header />}
      <Routes>
        <Route path='/' element={authUser ? <HomePage /> : <Navigate to='/login' />} />
        <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to='/' />} />
        <Route path='/signup' element={!authUser ? <SignUpPage /> : <Navigate to='/' />} />
        <Route
          path='/transaction/:id'
          element={authUser ? <TransactionPage /> : <Navigate to='/login' />}
        />
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
