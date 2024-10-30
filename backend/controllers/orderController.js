import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

// global valiable
const currency = "inr";
const deliveryCharge = 10;

// gateway initilize
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// placing order using Cash on delivery
const placOrder = async (req, res) => {
   try {
      const { userId, items, amount, address } = req.body;

      const orderData = {
         userId,
         items,
         amount,
         address,
         paymentMethod: "COD",
         payment: false,
         date: Date.now(),
      };

      const newOrder = new orderModel(orderData);
      await newOrder.save();

      await userModel.findByIdAndUpdate(userId, { cartData: {} });

      res.json({
         success: true,
         message: "Order placed successfully",
      });
   } catch (error) {
      console.log(error);

      res.json({
         success: false,
         message: error.message,
      });
   }
};

// placing order using Stripe Method
const placeOrderStripe = async (req, res) => {
   try {
      const { userId, items, amount, address } = req.body;
      const { origin } = req.headers;

      const orderData = {
         userId,
         items,
         amount,
         address,
         paymentMethod: "Stripe",
         payment: false,
         date: Date.now(),
      };

      const newOrder = new orderModel(orderData);
      await newOrder.save();

      const line_items = items.map((item) => ({
         price_data: {
            currency: currency,
            product_data: {
               name: item.name,
            },
            unit_amount: item.price * 100,
         },
         quantity: item.quantity,
      }));

      line_items.push({
         price_data: {
            currency: currency,
            product_data: {
               name: "Delivery Charges",
            },
            unit_amount: deliveryCharge,
         },
         quantity: 1,
      });

      const session = await stripe.checkout.sessions.create({
         success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
         cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
         line_items,
         mode: "payment",
      });

      res.json({
         success: true,
         session_url: session.url,
      });
   } catch (error) {
      console.log(error);
      res.json({
         success: false,
         message: error.message,
      });
   }
};

// Verify Stripe
const verifyStripe = async (req, res) => {
   const { orderId, success, userId } = req.body;
   try {
      if (success === "true") {
         await orderModel.findByIdAndUpdate(orderId, { payment: true });
         await userModel.findByIdAndUpdate(userId, { cartData: {} });

         res.json({ success: true });
      } else {
         await orderModel.findByIdAndDelete(orderId);

         res.json({ success: false });
      }
   } catch (error) {
      console.log(error);
      res.json({
         success: false,
         message: error.message,
      });
   }
};

// place order using Razorpay Method
const placeOrderRazorPay = async (req, res) => {};

// All order data for admin panel
const allOrders = async (req, res) => {
   try {
      const orders = await orderModel.find({}).sort({ createdAt: -1 });
     

      res.json({
         success: true,
         orders,
      });
   } catch (error) {
      console.log(error);
      res.json({
         success: false,
         message: error.message,
      });
   }
};

// User Order data for frontend
const userOrder = async (req, res) => {
   try {
      const { userId } = req.body;

      const orders = await orderModel.find({ userId });

      res.json({
         success: true,
         orders,
      });
   } catch (error) {
      console.log(error);
      res.json({
         success: false,
         message: error.message,
      });
   }
};

// Update order status from admin panel
const updateStatus = async (req, res) => {
   try {
      const { orderId, status } = req.body;

      await orderModel.findByIdAndUpdate(orderId, { status });

      res.json({
         success: true,
         message: "Order status updated successfully",
      });
   } catch (error) {
      console.log(error);
      res.json({
         success: false,
         message: error.message,
      });
   }
};

export {
   placOrder,
   placeOrderStripe,
   placeOrderRazorPay,
   allOrders,
   userOrder,
   updateStatus,
   verifyStripe,
};