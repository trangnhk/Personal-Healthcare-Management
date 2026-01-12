export const endpoints = {
    'register': '/users/',
    'login': '/o/token/',
    'currentUser': '/users/current-user/',
    'experts': '/users/experts/',
    'expertDetail': (id) => `/users/${id}/expert-detail/`,
    'publicExercises': '/exercises/',
    'workoutplans': '/workout-plans/',
};