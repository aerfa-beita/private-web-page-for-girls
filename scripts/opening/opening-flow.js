(function () {
    'use strict';

    var initialized = false;
    var lockScreen;
    var lockInput;

    function openPasswordGate() {
        if (!lockScreen) return;
        lockScreen.classList.remove('hidden');
        window.setTimeout(function () {
            if (lockInput) lockInput.focus();
        }, 420);
    }

    function returnToCinematic() {
        if (!lockScreen) return;
        lockScreen.classList.add('hidden');
        if (window.UniverseCinematicOpening) window.UniverseCinematicOpening.returnToPassword();
    }

    function completePassword() {
        if (window.UniverseCinematicOpening) window.UniverseCinematicOpening.completePassword();
    }

    function init() {
        if (initialized) return;
        initialized = true;
        lockScreen = document.getElementById('lock-screen');
        lockInput = document.getElementById('lock-input');

        window.addEventListener('cinematicPasswordRequested', openPasswordGate);
        if (window.UniverseCinematicOpening) window.UniverseCinematicOpening.init();
    }

    window.UniverseOpeningFlow = {
        init: init,
        returnToCinematic: returnToCinematic,
        completePassword: completePassword
    };
})();
