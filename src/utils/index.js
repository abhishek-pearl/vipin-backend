// validities
// export const accessTokenValidity = "15m";
// export const refreshTokenValidity = "15d";
// ----------------------------------------------------------------------------------------

// httpOnlyCookieValidity - setting the validity for http only cookie


// saveAccessTokenToCookie - this method saved the access token to the http only cookie
export const saveAccessTokenToCookie = (res, token) => {
  const httpOnlyCookieValidity = () => {
    let currentDate = new Date();
    return new Date(currentDate.getTime() + 15 * 24 * 60 * 60 * 1000); // 15 days validity
  };
  
  return res.cookie("DHANLAXMI_ACCESS_TOKEN", token, {
    httpOnly: false,
    expires: httpOnlyCookieValidity(),
    sameSite: process.env.NODE_ENV === "production" ? "none" : "Lax",
    ...(process.env.NODE_ENV === "production" && { secure: true }),
  });
};

export const saveRefreshTokenToCookie = (res, token) => {
  const httpOnlyCookieValidity = () => {
    let currentDate = new Date();
    return new Date(currentDate.getTime() + 15 * 24 * 60 * 60 * 1000); // 15 days validity
  };

  return res.cookie("DHANLAXMI_REFRESH_TOKEN", token, {
    httpOnly: false,
    expires: httpOnlyCookieValidity(),
    sameSite: process.env.NODE_ENV === "production" ? "none" : "Lax",
    ...(process.env.NODE_ENV === "production" && { secure: true }),
  });
};
