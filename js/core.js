/**
 * Core Application Logic
 * Initializes the App namespace and shared state.
 */

const App = {
    state: {
        currentDate: new Date(),
        currMonth: new Date().getMonth(),
        currYear: new Date().getFullYear(),
        caseCount: 246
    },

    config: {
        months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    },

    init() {
        // Initialize Modules if they exist
        if(this.Navigation) this.Navigation.init();
        if(this.Calendar) this.Calendar.init();
        if(this.Cases) this.Cases.init();
        if(this.Registration) this.Registration.init();
        if(this.Settings) this.Settings.init();
    }
};