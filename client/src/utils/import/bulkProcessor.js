export const processBulk = async (rows, onProgress) => {
  for (let i = 0; i < rows.length; i++) {
    // pretend to process
    onProgress && onProgress(i + 1, rows.length);
  }
  return { success: true, processed: rows.length };
};

export default processBulk;
