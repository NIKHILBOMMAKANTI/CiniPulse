const {body} = require("express-validator");

let registerValidator = [
  body("username")
    .notEmpty().withMessage("username Required")
    .isLength({ min: 6 }).withMessage("username Length Should be atleast 6 characters long"),

  body("email")
    .notEmpty().withMessage("Email Required")
    .isEmail().withMessage("Invalid Email Format"),

  body("password")
    .notEmpty().withMessage("Password Required")
    .isLength({ min: 8 }).withMessage("Password Length should be atleast 8 characters long")
    .matches(/[A-Z]/).withMessage("Password must contain atleast one Uppercase letter")
    .matches(/[a-z]/).withMessage("Password must contain atleast one Lowercase letter")
    .matches(/[0-9]/).withMessage("Password must contain one digit")
    .matches(/[\W_]/).withMessage("Password must have atleast one Special Character"),

  body("confirmpassword")
    .notEmpty()
    .withMessage("Confirm Password is required")
    .custom((value, { req }) => {
      if (value != req.body.password) {
        throw new Error("Passwords does not Match")
      }
      return true;
    }),
];

let loginValidator = [
  body("email")
    .notEmpty().withMessage("Email Required")
    .isEmail().withMessage("Invalid Email Format"),

    body("password")
    .notEmpty().withMessage("Password Required")
];

let reviewvalidator = [
  body("content").notEmpty().withMessage("Review Required"),
  body("rating").notEmpty().withMessage("Rating Required")
]
module.exports = {registerValidator,loginValidator,reviewvalidator}
