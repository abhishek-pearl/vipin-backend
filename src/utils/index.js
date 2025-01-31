// validities
// export const accessTokenValidity = "15m";
// export const refreshTokenValidity = "15d";
// ----------------------------------------------------------------------------------------

// httpOnlyCookieValidity - setting the validity for http only cookie


// saveAccessTokenToCookie - this method saved the access token to the http only cookie
export const saveAccessTokenToCookie = (res, token) => {
  const httpOnlyCookieValidity = () => {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 360); // Adding 360 days
    return expirationDate;
  };
  
  
  return res.cookie("DHANLAXMI_ACCESS_TOKEN", token, {
    httpOnly: true,
    expires: httpOnlyCookieValidity(),
    sameSite: process.env.NODE_ENV =="production" ? "none" : "Lax",
    ...(process.env.NODE_ENV == "production" && { secure: true }),
  });
};

export const saveRefreshTokenToCookie = (res, token) => {
  const httpOnlyCookieValidity = () => {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 360); // Adding 360 days
    return expirationDate;
  };
  
  return res.cookie("DHANLAXMI_REFRESH_TOKEN", token, {
    httpOnly: true,
    expires: httpOnlyCookieValidity(),
    sameSite: process.env.NODE_ENV == "production" ? "none" : "Lax",
    ...(process.env.NODE_ENV == "production" && { secure: true }),
  });
};
