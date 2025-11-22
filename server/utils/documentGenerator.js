// Generate unique document numbers
const generateReceiptNumber = async (Receipt) => {
  const count = await Receipt.countDocuments();
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `RCP-${year}${month}-${String(count + 1).padStart(5, '0')}`;
};

const generateDeliveryNumber = async (DeliveryOrder) => {
  const count = await DeliveryOrder.countDocuments();
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `DLV-${year}${month}-${String(count + 1).padStart(5, '0')}`;
};

const generateTransferNumber = async (InternalTransfer) => {
  const count = await InternalTransfer.countDocuments();
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `TRN-${year}${month}-${String(count + 1).padStart(5, '0')}`;
};

const generateAdjustmentNumber = async (StockAdjustment) => {
  const count = await StockAdjustment.countDocuments();
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `ADJ-${year}${month}-${String(count + 1).padStart(5, '0')}`;
};

module.exports = {
  generateReceiptNumber,
  generateDeliveryNumber,
  generateTransferNumber,
  generateAdjustmentNumber,
};
