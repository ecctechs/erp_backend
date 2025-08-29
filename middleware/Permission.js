const authPage = (permissions) => {
  return (req, res, next) => {
    const userRole = req.session.role_name;
    if (req.session.UserRole) {
      if (permissions.includes(userRole)) {
        next();
      } else {
        res.json({
          status: 401,
          message: "You Not Permission",
        });
      }
    } else {
      res.json({
        status: 401,
        message: "Please Login First",
      });
    }
  };
};

module.exports = { authPage };
