import ejs from "ejs";
import { transporter } from "../utils/nodeMailer.js";

/* send email on dfrnt events */

export let sendWelcomeEmail = (obj) => {
    ejs.renderFile(
        global.appRoot + "/templates/welcome.ejs",
        { ...obj },
        function (err, data) {
            if (err) {
                console.log(err);
            } else {
                let info = transporter.sendMail({
                    from: "Hamza Flaws", // sender address
                    to: obj.to, // list of receivers
                    subject: "Welcome ✔", // Subject line
                    html: data, // html body
                });
            }
        }
    );
};

export let forgetPasswordEamil = (obj) => {
    ejs.renderFile(
        global.appRoot + "/templates/forgetPassword.ejs",
        { ...obj },
        function (err, data) {
            if (err) {
                console.log(err);
            } else {
                let info = transporter.sendMail({
                    from: "Hamza Flaws", // sender address
                    to: obj.to, // list of receivers
                    subject: "Forget Password", // Subject line
                    html: data, // html body
                });
            }
        }
    );
};

export let placedOrderEmail = (obj) => {
    ejs.renderFile(
        global.appRoot + "/templates/orderPlaced.ejs",
        { ...obj },
        function (err, data) {
            if (err) {
                console.log(err);
            } else {
                let info = transporter.sendMail({
                    from: "Hamza Flaws", // sender address
                    to: obj.email || "", // list of receivers
                    subject: "Order Placed", // Subject line
                    html: data, // html body
                });
            }
        }
    );
};

export let alertAdminOnNewOrderPlaced = (obj) => {
    ejs.renderFile(
        global.appRoot + "/templates/newOrderAlert.ejs",
        { ...obj },
        function (err, data) {
            if (err) {
                console.log(err);
            } else {
                let info = transporter.sendMail({
                    from: "Hamza Flaws", // sender address
                    to: ["muhamedusama468@gmail.com"], // Clothing.faboo@gmail.com  list of admin
                    subject: "New Order Arrived", // Subject line
                    html: data, // html body
                });
            }
        }
    );
};
