(function () {
    'use strict';

    var rawConfig = window.__CONFIG__ || {};
    var firebaseConfig = rawConfig.FIREBASE_CONFIG || {};
    var weatherApiKey = typeof rawConfig.WEATHER_API_KEY === 'string'
        ? rawConfig.WEATHER_API_KEY.trim()
        : '';

    function hasRequiredFirebaseFields(config) {
        return Boolean(config && ['apiKey', 'authDomain', 'projectId', 'appId']
            .every(function (key) { return typeof config[key] === 'string' && config[key].trim(); }));
    }

    window.UniverseRuntimeConfig = Object.freeze({
        firebaseConfig: firebaseConfig,
        weatherApiKey: weatherApiKey,
        hasFirebase: hasRequiredFirebaseFields(firebaseConfig),
        hasWeather: Boolean(weatherApiKey)
    });
})();
