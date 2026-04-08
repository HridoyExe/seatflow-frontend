export const apiEndpoints = {
  auth: {
    login: "/auth/jwt/create/",
    register: "/auth/register/",
    logout: "/auth/logout/",
    profile: "/auth/users/me/",
    changePassword: "/auth/users/set_password/",
  },
  menu: {
    items: "/api/menu/items/",
    itemDetails: (id) => `/api/menu/items/${id}/`,
    categories: "/api/menu/categories/",
    categoryDetails: (id) => `/api/menu/categories/${id}/`,
    itemImages: (itemPk) => `/api/menu/items/${itemPk}/images/`,
    imageDetails: (itemPk, id) => `/api/menu/items/${itemPk}/images/${id}/`,
    itemReviews: (itemPk) => `/api/menu/items/${itemPk}/reviews/`,
    reviewDetails: (itemPk, id) => `/api/menu/items/${itemPk}/reviews/${id}/`,
  },
  booking: {
    bookings: "/api/booking/bookings/",
    bookingDetails: (id) => `/api/booking/bookings/${id}/`,
    orderItems: "/api/booking/order-items/",
    orderItemDetails: (id) => `/api/booking/order-items/${id}/`,
    seats: "/api/booking/seats/",
    seatDetails: (id) => `/api/booking/seats/${id}/`,
    userHistory: "/api/booking/bookings/",
    stats: "/api/booking/stats/",
  },
  payment: {
    initiate: "/api/payment/initiate/",
    success: "/api/payment/success/",
    fail: "/api/payment/fail/",
  },
};
