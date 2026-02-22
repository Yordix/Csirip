import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import AdminLayout from "./components/admin/AdminLayout";
import AdminRouteGuard from "./components/admin/AdminRouteGuard";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import GalleryPage from "./pages/GalleryPage";
import RelaxPage from "./pages/RelaxPage";
import BookingPage from "./pages/BookingPage";
import ContactPage from "./pages/ContactPage";
import BlogPage from "./pages/BlogPage";
import BlogPostPage from "./pages/BlogPostPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminStatsPage from "./pages/AdminStatsPage";
import AdminBillingPage from "./pages/AdminBillingPage";
import AdminContentPage from "./pages/AdminContentPage";
import AdminLocalizationPage from "./pages/AdminLocalizationPage";
import AdminImagesPage from "./pages/AdminImagesPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/rolunk" element={<AboutPage />} />
        <Route path="/galeria" element={<GalleryPage />} />
        <Route path="/kikapcsolodas" element={<RelaxPage />} />
        <Route path="/foglalas" element={<BookingPage />} />
        <Route path="/kapcsolat" element={<ContactPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
      </Route>

      <Route path="/admin" element={<AdminLoginPage />} />

      <Route element={<AdminRouteGuard />}>
        <Route path="/admin/dashboard" element={<Navigate to="/admin/app/dashboard" replace />} />
        <Route path="/admin/app" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="statisztikak" element={<AdminStatsPage />} />
          <Route path="szamlazas" element={<AdminBillingPage />} />
          <Route path="kepek" element={<AdminImagesPage />} />
          <Route path="tartalom" element={<AdminContentPage />} />
          <Route path="lokalizacio" element={<AdminLocalizationPage />} />
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
