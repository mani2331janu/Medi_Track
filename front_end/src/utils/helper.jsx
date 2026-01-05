import React from "react";
// utils/formatDate.js
import dayjs from "dayjs";
import { BLOOD_GROUP, Gender, ROLE } from "../constant/constant";

export const displayDateFormat = (date) => {
    return date ? dayjs(date).format("DD-MM-YYYY") : "";
};


export const getUploadLogStatus = (status) => {

    switch (status) {
        case 1:
            return (
                <span className="bg-orange-400 text-white px-2 py-1 inline-flex items-center rounded-md text-sm">
                    In-Progress
                </span>
            );
        case 2:
            return (
                <span className="bg-red-500 text-white px-2 py-1 inline-flex items-center rounded-md text-sm">
                    Failed
                </span>
            );
        case 3:
            return (
                <span className="bg-green-500 text-white px-2 py-1 inline-flex items-center rounded-md text-sm">
                    Success
                </span>
            );
        case 4:
            return (
                <span className="bg-gray-400 text-white px-2 py-1 inline-flex items-center rounded-md text-sm">
                    Error
                </span>
            );
    }
};

export const displayStatus = (status) => {
    switch (Number(status)) {
        case 1:
            return "Active";
        case 0:
            return "Inactive";
        default:
            return "Unknown";
    }
};

export const getBloodGroup = (value) => {
    value = Number(value);
    switch (value) {
        case BLOOD_GROUP.A_POS:
            return "A+";
        case BLOOD_GROUP.A_NEG:
            return "A-";
        case BLOOD_GROUP.B_POS:
            return "B+";
        case BLOOD_GROUP.B_NEG:
            return "B-";
        case BLOOD_GROUP.AB_POS:
            return "AB+";
        case BLOOD_GROUP.AB_NEG:
            return "AB-";
        case BLOOD_GROUP.O_POS:
            return "O+";
        case BLOOD_GROUP.O_NEG:
            return "O-";
        default:
            return "-";
    }
}

export const getGender = (value) => {
    value = Number(value);
    switch (value) {
        case Gender.MALE:
            return "Male";
        case Gender.FEMALE:
            return "Female";
        case Gender.OTHERS:
            return "Others";
        default:
            return "-";
    }
}

export const getRoleName = (value) => {
    value = Number(value);
    switch (value) {
        case ROLE.SUPER_ADMIN:
            return "Super Admin";
        case ROLE.NORMAL_USER:
            return "Normal User";
        case ROLE.SUPERVISOR:
            return "Supervisor"
        default:
            return "-";
    }
}



