let ErrorHandler = (error, req, res, next) => {
  // console.log("er: ", error);

  return res.status(error.status || 500).json({
    message: error.message,
    statusCode: error.status || 500,
    success: false,
  });
};

export default ErrorHandler;