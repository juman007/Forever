import express from "express";
import {
   allOrders,
   placeOrderRazorPay,
   placeOrderStripe,
   placOrder,
   updateStatus,
   userOrder,
   verifyStripe,
} from "../controllers/orderController.js";
import authUser from "../middleware/auth.js";
import adminAuth from "../middleware/adminAuth.js";

const orderRoute = express.Router();

// Admin routes
orderRoute.post("/list", adminAuth, allOrders);
orderRoute.post("/status", adminAuth, updateStatus);

// Payment features
orderRoute.post("/place", authUser, placOrder);
orderRoute.post("/stripe", authUser, placeOrderStripe);
orderRoute.post("/razorpay", authUser, placeOrderRazorPay);

// User features
orderRoute.post("/user-orders", authUser, userOrder);

// Verify payment
orderRoute.post("/verifyStripe", authUser, verifyStripe);

export default orderRoute;
