const roleMiddleware = (roles) => {
    return (req, res, next) => {
        const userRole = req.user.role; // Asumiendo que el rol del usuario está en req.user

        if (!roles.includes(userRole)) {
            return res.status(403).json({
                success: false,
                message: "Acceso denegado. No tienes permisos suficientes.",
            });
        }

        next();
    };
};

module.exports = roleMiddleware;