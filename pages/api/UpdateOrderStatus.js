// pages/api/updateOrderStatus.js

import Order from '../../models/JVCORDER';
import connectDb from '../../middleware/mongoose';

const handler = async (req, res) => {
  const { orderId, newStatus } = req.body;

  try {
    const order = await Order.findByIdAndUpdate(orderId, { deliverystatus: newStatus }, { new: true });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.status(200).json({ message: 'Order status updated successfully', order });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order status' });
  }
};

export default connectDb(handler);
