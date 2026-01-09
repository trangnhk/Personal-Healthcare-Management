export const endpoints = {
    'register': '/users/',
    'login': '/o/token/',
    'current-user': '/users/current-user/',
    'experts': '/users/experts/',
    'expertDetail': (id) => `/users/${id}/expert-detail/`,
    'publicExercises': '/exercises/',
};