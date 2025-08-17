import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoadingScreen from './LoadingScreen';

const SuspenseRoutes = ({ routes, user }) => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        {routes.map((route) => {
          if (route.requiresAuth) {
            return (
              <Route
                key={route.path}
                path={route.path}
                element={
                  user ? (
                    route.element
                  ) : (
                    <Navigate
                      to="/login"
                      state={{ from: { pathname: route.path } }}
                    />
                  )
                }
              />
            );
          }
          return (
            <Route
              key={route.path}
              path={route.path}
              element={route.element}
            />
          );
        })}
      </Routes>
    </Suspense>
  );
};

export default SuspenseRoutes;
