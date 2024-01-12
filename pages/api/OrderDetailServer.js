// orderDetailsServer.js

import Order from '../../models/JVCORDER';
import mongoose from 'mongoose';

export async function getOrderDetails(context) {
  if (!mongoose.connections[0].readyState) {
    await mongoose.connect(process.env.MONGO_URI);
  }

  const order = await Order.findById(context.query.id);

  return JSON.parse(JSON.stringify(order));
}
