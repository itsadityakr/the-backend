// Promise Verison

const asyncHandler = (requestHandler) => {
    (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((error) =>
            next(error)
        );
    };
};

export { asyncHandler };

// const asyncHandler = () => {}
// const asyncHandler = (fn) => {}
// const asyncHandler = (fn) => {() => {}}
// const asyncHandler = (fn) => () => {}
// const asyncHandler = (fn) => async() => {}

// Try Catch Verison
// const asyncHandler = (fn) => async (req, res, next) => {
//     try {
//         await fn(req, res, next);
//     } catch (error) {
//         res.status(error.code || 500).json({
//             success: false,
//             message: error.message,
//         });
//     }
// };
