import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Login from "./Auth/Login.jsx";
import Register from "./Auth/Register.jsx";
import Dashboard from "./Customer/Dashboard.jsx";
import Product from "./Customer/Product.jsx";
import Cart from "./Customer/Cart.jsx";
import Purchased from "./Customer/Purchased.jsx";
import Profile from "./Customer/Profile.jsx";
import AdminDashboard from "./Admin/AdminDashboard.jsx";

const pageTransitionVariants = {
  initial: { x: "100vw", opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: "-100vw", opacity: 0 },
};

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <motion.div
              variants={pageTransitionVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ type: "tween", duration: 0.3 }}
            >
              <Login />
            </motion.div>
          }
        />
        <Route
          path="/register"
          element={
            <motion.div
              variants={pageTransitionVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ type: "tween", duration: 0.5 }}
            >
              <Register />
            </motion.div>
          }
        />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/product" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/purchased" element={<Purchased />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </AnimatePresence>
  );
};

const Routings = () => {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
};

export default Routings;
