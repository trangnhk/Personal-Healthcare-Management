export const endpoints = {
    'register': '/users/',
    'login': '/o/token/',
    'currentUser': '/users/current-user/',
    'experts': '/users/experts/',
    'expertDetail': (id) => `/users/${id}/expert-detail/`,
    'publicExercises': '/exercises/',
    'workoutplans': '/workout-plans/',
    'workoutplanDetail': (workout_plan_pk) => `/workout-plans/${workout_plan_pk}/exercises/`,
    'healthdiaries': '/healthdiaries/',
    'healthdiariesByDate': '/healthdiaries/by-date/',
    'healthdiariesByWorkout': '/healthdiaries/by-workout/',
    
};