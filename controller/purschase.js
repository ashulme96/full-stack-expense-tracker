const { Order } = require('../model/orders')
const { User } = require('../model/login.js')
const Razorpay = require('razorpay');

const purchaseMemberShip = async (req, res) => {
    const rzp = new Razorpay({ key_id: 'rzp_test_2sf8sXwrPIgwF9', key_secret: '2CK048VIJUFg4IONjbhdgnbR' });
    const options = {
        amount: 50000,
        currency: "INR"
    }
    const order = await rzp.orders.create(options);
    // console.log("order>>>>>>>>>", order)
    //till now order is created
    try {
        const response = await Order.create({ orderid: order.id, status: 'PENDING', userdetailId: req.user.id })
        // console.log(response)
        res.status(201).json({ order, key_id: rzp.key_id })
    } catch (error) {
        console.log(error);
    }
}



const updatetransactionstatus = async (req, res) => {
    const { order_id, payment_id,payment_failed } = req.body;
    try {
        if (payment_failed===true) {
            const failure= await Order.create(
                { orderId: order_id,status: "fail" },
                { where: { orderId: order_id } }
            );
            // console.log("failure>>>>>",failure);
            await User.update(
                { isPremimum: false },
                { where: { id: req.user.id } }
            );
            console.log("Transaction marked as failed due to payment failure");
        } else {
            await Order.update(
                { paymentId: payment_id, orderId: order_id, status: "successful" },
                { where: { userdetailId: req.user.id } }
            );
            await User.update(
                { isPremimum: true },
                { where: { id: req.user.id } }
            );
            console.log("Transaction and user details updated successfully");
        }

        res.status(202).json({ success: true, message: "Transaction status updated" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error updating transaction status" });
    }
}

module.exports = {
    purchaseMemberShip,
    updatetransactionstatus
}