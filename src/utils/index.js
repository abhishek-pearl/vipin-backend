// validities
// export const accessTokenValidity = "15m";
// export const refreshTokenValidity = "15d";
// ----------------------------------------------------------------------------------------

// httpOnlyCookieValidity - setting the validity for http only cookie
const httpOnlyCookieValidity = () => {
  let currentDate = new Date();
  return new Date(currentDate.getTime() + 365 * 24 * 60 * 60 * 1000); // 15 days validity
};

// saveAccessTokenToCookie - this method saved the access token to the http only cookie
export const saveAccessTokenToCookie = (res, token) => {
  return res.cookie("VIPINBHAIIKA_ACCESS_TOKEN", token, {
    httpOnly: true,
    expires: httpOnlyCookieValidity(),
    sameSite: process.env.NODE_ENV === "production" ? "none" : "Lax",
    ...(process.env.NODE_ENV === "production" && { secure: true }),
  });
};
