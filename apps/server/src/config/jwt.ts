export const getJwtConfig = () => ({
  secret: process.env.JWT_SECRET,
  accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
})
