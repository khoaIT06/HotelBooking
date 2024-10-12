import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import {publicRoutes} from '~/user/routes'
import React, { useState, useEffect } from 'react';
import DefaultLayout from '~/user/components/Layout/DefaultLayout';
import '@fortawesome/fontawesome-free/css/all.min.css';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminRoutes from "~/admin/AdminRoutes"
import AdminLayout from "~/admin/components/Layout/DefaultLayout"
import AdminRoute from './admin/AdminRoute';

import Header from '~/user/components/Layout/Header';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          {publicRoutes.map((route, index) => {
            let Layout = DefaultLayout;
            const Page = route.component;
            return (
              <Route 
                key={index} 
                path={route.path} 
                element={
                  <Layout>
                    <Page />
                  </Layout>
                } 
              />
            );
          })}

          {AdminRoutes.map((route, index) => {
            let Layout = AdminLayout;
            const Page = route.component;
            return (
              <Route 
                key={index} 
                path={route.path} 
                element={
                  <AdminRoute>
                    <Layout>
                      <Page />
                    </Layout>
                  </AdminRoute>
                } 
              />
            );
          })}
        </Routes>
        <ToastContainer />
      </div>
    </Router>
  );
}

export default App;