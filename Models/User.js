const mongoose = require('mongoose');

// Define the User Schema
const UserSchema = mongoose.Schema({
    userName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['master', 'super admin', 'hr', 'employee'], // Allowed roles
        required: true,
    },
    permissions: {
        type: Array, // Array of permission objects
        default: [], // Initially empty
    },
    otp: {
        type: Number,

    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Pre-Save Middleware to Set Permissions Based on Role
UserSchema.pre('save', function (next) {
    if (this.isModified('role') || this.isNew) {
        switch (this.role) {
            case 'master':
                this.permissions = [
                    { headerPermission: ['home', 'about us', 'login', 'signup', 'dashboard', 'profile', 'settings'] },
                    { footerPermission: ['contact', 'privacy policy', 'terms of service'] },
                    { adminPanel: ['manageUsers', 'viewReports', 'settings'] },
                    { employeeManagement: ['viewEmployeeList', 'editEmployee', 'addEmployee'] },
                ];
                break;
            case 'super admin':
                this.permissions = [
                    { headerPermission: ['home', 'about us', 'login', 'signup', 'dashboard', 'profile'] },
                    { footerPermission: ['contact', 'privacy policy', 'terms of service'] },
                    { adminPanel: ['manageUsers', 'viewReports', 'settings'] },
                    { hrManagement: ['viewEmployeeList', 'editEmployee', 'addEmployee'] },
                ];
                break;
            case 'hr':
                this.permissions = [
                    { headerPermission: ['home', 'about us', 'login', 'signup', 'profile'] },
                    { footerPermission: ['contact', 'privacy policy'] },
                    { hrPanel: ['viewEmployeeList', 'editEmployee'] },
                ];
                break;
            case 'employee':
                this.permissions = [
                    { headerPermission: ['home', 'about us', 'login', 'signup', 'profile'] },
                    { footerPermission: ['contact'] },
                    { employeePanel: ['viewOwnProfile', 'updateProfile'] },
                ];
                break;
            default:
                this.permissions = [];
        }
    }
    next();
});

module.exports = mongoose.model('User', UserSchema);
