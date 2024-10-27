const checkRole = (allowedRoles) => {
    return (req, res, next) => {
      const userRole = req.userData.role;
      if (allowedRoles.includes(userRole)) {
        next();
      } else {
        return res.status(403).json({
          success: false,
          message: "Gabole akses, orang keren only",
        });
      }
    };
  };
  
  module.exports = {checkRole}