// Common response formats
const successResponse = (data, message = 'Success', statusCode = 200) => {
  return {
    success: true,
    statusCode,
    message,
    data,
  };
};

const errorResponse = (message = 'Error', statusCode = 500, errors = null) => {
  return {
    success: false,
    statusCode,
    message,
    errors,
  };
};

const paginatedResponse = (data, total, page, limit, message = 'Success') => {
  return {
    success: true,
    message,
    data,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  };
};

module.exports = {
  successResponse,
  errorResponse,
  paginatedResponse,
};
