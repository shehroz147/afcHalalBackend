const Product = require("../Model/Product");
const User = require("../Model/User");
// import Cart, { addToCart } from "../Models/cart.js";
import paypal from "paypal-rest-sdk";
// import {
//     placedOrderEmail,
//     alertAdminOnNewOrderPlaced,
// } from "../helpers/emailHelper.js";

export const addProductToCart = async (req, res, next) => {
    try {
        const productId = req.body.productId;
        const quantity = req.body.quantity;
        const price = req.body.price;
        const userId = req.body.userId;
        let cart = await Cart.findOne({ user: userId });
        const product = await Product.findById({ _id: productId });
        console.log(product);
        if (cart) {
            cart = await addToCart(cart, product, quantity, price);
            // await cart.save();
        } else {
            cart = new Cart({
                user: userId,
                items: [],
            });
            // await cart.save();
            const cart = await addToCart(cart, product, quantity, price);
            await cart.save();
        }

        const CartProduct = await Cart.findOne({ userId: userId }).populate(
            "items.productId"
        );
        res.status(200).json(CartProduct);
    } catch (e) {
        res.status(500).json({ message: "something went wrong in Add to Cart" });
        console.log(e);
    }
};

export const removeProductFromCart = async (req, res, next) => {
    try {
        const productId = req.params.productId;

        const cart = await Cart.findById({ _id: req.body.id });

        await cart.removeFromCart(productId);
        //console.log(CartProduct);
        const userCart = await Cart.findById(req.body.id).populate(
            "items.productId"
        );
        res.status(200).json(userCart);
    } catch (e) {
        res
            .status(500)
            .json({ message: "something went wrong in remove product from Cart" });
        console.log(e);
    }
};

export const postCheckout = async (req, res, next) => {
    try {
        const user = await User.findById({ _id: req.body.userID });
        let total = 0;
        const userCart = null;
        console.log('userrrrrrrrr',user)
        // user.firstName = req.body.firstName;
        // user.lastName = req.body.lastName;
        user.shippingAddress = req.body.shippingAddress;
        user.contactDetails = req.body.contactDetails;
        // user.city = req.body.city;
        // user.province = req.body.province;
        await user.save();

        const order = new Order({
            userId: req.body.userID,
            status: "pending",
            categorey:   req.body.categorey,
            subCategorey: req.body.subCategorey,
            // total: req.body.total,
        });

        console.log('orderrrrrrrrr',order)
        await order.save();

        // await user.clearCart();

        // // send email to user

        res.status(200).json({ message: "Your order has been placed",data:order });
    } catch (e) {
        res.status(500).json({ message: "something went wrong in Placing Order" });
        console.log(e);
    }
};

export const myOrders = async (req, res, next) => {
    try {
        const order = await Order.find({ userId: req.userId });

        if (!order) {
            return res
                .status(200)
                .json({ message: "You have not ordered anything yet" });
        }
        res.status(200).json(order);
    } catch (e) {
        res.status(500).json({ message: "something went wrong in myOrder" });
        console.log(e);
    }
};

export const myOrderss = async (req, res, next) => {
    try {
        const order = await Order.find({ userId: req.body.userID}).sort({"createdAt":-1});
        if (!order) {
            return res
                .status(200)
                .json({ message: "You have not ordered anything yet" });
        }
        res.status(200).json(order);
    } catch (e) {
        res.status(500).json({ message: "something went wrong in myOrder" });
        console.log(e);
    }
};

export const getPaypall = async (req, res, next) => {
    try {
        let create_payment_json = {
            intent: "sale",
            payer: {
                payment_method: "paypal",
            },
            redirect_urls: {
                return_url: "https://hamza-flaws.herokuapp.com/success",
                cancel_url: "https://hamza-flaws.herokuapp.com/cancel",
            },
            transactions: [
                {
                    amount: {
                        currency: "GBP",
                        total: "0.1",
                    },
                    description: "This is the demo description.",
                },
            ],
        };

        paypal.payment.create(create_payment_json, function (error, payment) {
            if (error) {
                throw error;
            } else {
                console.log("Create Payment Response");

                res.redirect(payment.links[1].href);
            }
        });
    } catch (e) {
        res.status(500).json({ message: "something went wrong in getPaypall" });
        console.log(e);
    }
};

export const paypallSuccess = (req, res) => {
    try {
        const PayerID = req.query.PayerID;
        const paymentId = req.query.paymentId;
        const execute_payment_json = {
            payer_id: PayerID,
            // transactions: [
            //   {
            //     amount: {
            //       currency: "USD",
            //       total: "1.00",
            //     },
            //   },
            // ],
        };

        paypal.payment.execute(
            paymentId,
            execute_payment_json,
            function (error, payment) {
                if (error) {
                    console.log(error.response);
                    throw error;
                } else {
                    console.log("Get Payment Response");
                    console.log(JSON.stringify(payment));
                    res.render("index");
                }
            }
        );
    } catch (e) {
        res.status(500).json({ message: "something went wrong in getPaypall" });
        console.log(e);
    }
};
