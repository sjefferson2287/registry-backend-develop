const jwt = require('jsonwebtoken')

const jwkToPem = require('jwk-to-pem')

const pem = jwkToPem({
  alg: 'RS256',
  kty: 'RSA',
  use: 'sig',
  x5c: [
    'MIIC+DCCAeCgAwIBAgIJBIGjYW6hFpn2MA0GCSqGSIb3DQEBBQUAMCMxITAfBgNVBAMTGGN1c3RvbWVyLWRlbW9zLmF1dGgwLmNvbTAeFw0xNjExMjIyMjIyMDVaFw0zMDA4MDEyMjIyMDVaMCMxITAfBgNVBAMTGGN1c3RvbWVyLWRlbW9zLmF1dGgwLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAMnjZc5bm/eGIHq09N9HKHahM7Y31P0ul+A2wwP4lSpIwFrWHzxw88/7Dwk9QMc+orGXX95R6av4GF+Es/nG3uK45ooMVMa/hYCh0Mtx3gnSuoTavQEkLzCvSwTqVwzZ+5noukWVqJuMKNwjL77GNcPLY7Xy2/skMCT5bR8UoWaufooQvYq6SyPcRAU4BtdquZRiBT4U5f+4pwNTxSvey7ki50yc1tG49Per/0zA4O6Tlpv8x7Red6m1bCNHt7+Z5nSl3RX/QYyAEUX1a28VcYmR41Osy+o2OUCXYdUAphDaHo4/8rbKTJhlu8jEcc1KoMXAKjgaVZtG/v5ltx6AXY0CAwEAAaMvMC0wDAYDVR0TBAUwAwEB/zAdBgNVHQ4EFgQUQxFG602h1cG+pnyvJoy9pGJJoCswDQYJKoZIhvcNAQEFBQADggEBAGvtCbzGNBUJPLICth3mLsX0Z4z8T8iu4tyoiuAshP/Ry/ZBnFnXmhD8vwgMZ2lTgUWwlrvlgN+fAtYKnwFO2G3BOCFw96Nm8So9sjTda9CCZ3dhoH57F/hVMBB0K6xhklAc0b5ZxUpCIN92v/w+xZoz1XQBHe8ZbRHaP1HpRM4M7DJk2G5cgUCyu3UBvYS41sHvzrxQ3z7vIePRA4WF4bEkfX12gvny0RsPkrbVMXX1Rj9t6V7QXrbPYBAO+43JvDGYawxYVvLhz+BJ45x50GFQmHszfY3BR9TPK8xmMmQwtIvLu1PMttNCs7niCYkSiUv2sc2mlq1i3IashGkkgmo=',
  ],
  n: 'yeNlzlub94YgerT030codqEztjfU_S6X4DbDA_iVKkjAWtYfPHDzz_sPCT1Axz6isZdf3lHpq_gYX4Sz-cbe4rjmigxUxr-FgKHQy3HeCdK6hNq9ASQvMK9LBOpXDNn7mei6RZWom4wo3CMvvsY1w8tjtfLb-yQwJPltHxShZq5-ihC9irpLI9xEBTgG12q5lGIFPhTl_7inA1PFK97LuSLnTJzW0bj096v_TMDg7pOWm_zHtF53qbVsI0e3v5nmdKXdFf9BjIARRfVrbxVxiZHjU6zL6jY5QJdh1QCmENoejj_ytspMmGW7yMRxzUqgxcAqOBpVm0b-_mW3HoBdjQ',
  e: 'AQAB',
  kid: 'NjVBRjY5MDlCMUIwNzU4RTA2QzZFMDQ4QzQ2MDAyQjVDNjk1RTM2Qg',
  x5t: 'NjVBRjY5MDlCMUIwNzU4RTA2QzZFMDQ4QzQ2MDAyQjVDNjk1RTM2Qg',
})

// const {
//   UserRole,
//   User,
//   Role,
//   brand_user_role: BrandUserRole,
//   retailer_user_role: RetailerUserRole,
//   brand_details: BrandDetails,
//   retailer_details: RetailerDetails,
// } = models

const signJWT = async (data) => {
  return await jwt.sign(data, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  })
}
const verifyToken = async (token) => {
  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET)

    return decoded
  } catch (err) {
    return false
  }
}

const verifyJWT = async (req, res, next) => {
  try {
    const token = req.headers.authorization
    // var client = jwksClient({
    //   jwksUri: "https://shopdot.us.auth0.com/.well-known/jwks.json",
    // });
    // function getKey(header, callback) {
    //   client.getSigningKey(header.kid, function (err, key) {
    //     var signingKey = key.publicKey || key.rsaPublicKey;
    //     callback(null, signingKey);
    //   });
    // }

    const decoded = await jwt.verify(token, pem)
    console.log(decoded)
  } catch (err) {
    console.log(err)
    res.status(401).json({ message: 'Unauthorized Request' })
  }
}

// const generateLoginJWT = async (user_id) => {
//   const isUserBrand = await BrandUserRole.findOne({
//     where: { user_id: user_id },
//   });

//   if (isUserBrand?.dataValues?.brand_id) {
//     const { id, ...others } = isUserBrand.dataValues;
//     return await signJWT({ ...others });
//   }

//   const isUserRetailer = await RetailerUserRole.findOne({
//     where: { user_id: user_id },
//   });

//   if (isUserRetailer?.dataValues?.retailer_id) {
//     const { id, ...others } = isUserRetailer.dataValues;
//     return await signJWT({ ...others });
//   }

//   const isUserRoleExist = await UserRole.findOne({ user_id: user_id });

//   if (isUserRoleExist) {
//     const { id, ...others } = isUserRoleExist.dataValues;
//     return await signJWT({ ...others });
//   } else {
//     const userData = await User.findByPk(user_id);
//     return await signJWT({ user_id: userData.dataValues.id });
//   }
// };
// const verifyJWT = async (req, res, next) => {
//   try {
//     const token = req.headers.authorization;
//     const decoded = await jwt.verify(token, process.env.JWT_SECRET);
//     let userDetails;

//     if (decoded.brand_id) {
//       const userData = await BrandUserRole.findOne({
//         where: { user_id: decoded.user_id },
//         include: [{ model: BrandDetails }, { model: User }, { model: Role }],
//       });
//       // console.log("BrandUserData", userData.dataValues);
//       req.user = userData.dataValues;
//       next();
//     } else if (decoded.retailer_id) {
//       const userData = await RetailerUserRole.findOne({
//         where: { user_id: decoded.user_id },
//         include: [{ model: RetailerDetails }, { model: User }, { model: Role }],
//       });
//       // console.log("RetailerUserData", userData.dataValues);

//       req.user = userData.dataValues;
//       next();
//     } else if (decoded.role_id) {
//       const userData = await UserRole.findOne({
//         where: { role_id: decoded.role_id },
//         include: [{ model: User }, { model: Role }],
//       });
//       // console.log("RoleUserData", userData.dataValues);

//       req.user = userData.dataValues;
//       next();
//     } else if (decoded.user_id) {
//       const userData = await User.findByPk(decoded.user_id);
//       // console.log("UserData", userData.dataValues);
//       req.user = { User: userData.dataValues };
//       next();
//     }
//     // console.log(userDetails.dataValues);
//     // req.user = userDetails;
//     // next();
//   } catch (err) {
//     res.status(401).json({ message: "Unauthorized Request" });
//   }
// };

// const verifyIsBrand = async (req, res, next) => {
//   try {
//     if (req?.user?.Role?.name === "brand") {
//       next();
//     } else {
//       res.status(401).json({ message: "Unauthorized Request" });
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(401).json({ message: "Unauthorized Request" });
//   }
// };
// const verifyIsRetailer = async (req, res, next) => {
//   try {
//     if (req?.user?.Role?.name === "retailer") {
//       next();
//     } else {
//       res.status(401).json({ message: "Unauthorized Request" });
//     }
//   } catch (error) {
//     res.status(401).json({ message: "Unauthorized Request" });
//   }
// };

module.exports = {
  signJWT,
  verifyJWT,
  verifyToken,
  // verifyIsBrand,
  // generateLoginJWT,
  // verifyIsRetailer,
}
