import React from "react";
import {accountType} from '../../../shared/constants';

const bankValidations = {
    ACCOUNT_NAME: {
        type: 'text',
        id: 'nameAccount',
        slug: 'acc_name',
        title: 'Enter Account Name',
        error: 'Invalid Account Name',
        required: true,
        pattern: /^[a-zA-Z]{2,}[^]+$/,
        autoCapitalize: "characters",
    },
    ACCOUNT_NUMBER: {
        type: 'text',
        id: 'numberAccount',
        slug: 'acc_number',
        title: 'Enter Account Number',
        error: "Invalid Account Number",
        pattern: /^[0-9]{9,18}$/,
        required: true,
    },
    IFSC: {
        type: 'text',
        id: 'ifscCode',
        title: 'Enter Average monthly Transactions',
        error: "Invalid Monthly Transactions",
        required: true,
        slug: 'ifsc_code',
        autoCapitalize: "characters",
        pattern: /[A-Za-z]{4}\d{7}$/,
    },
    ACCOUNT_TYPE: {
        type: 'dropdown',
        id: 'accountType',
        slug: 'acc_type',
        title: 'Select Account',
        error: "Select Bank Account Type",
        pattern: /^[^]+$/,
        options: accountType,
        required: true
    },
    BANK_NAME: {
        id: 'nameBank',
        type: 'text',
        title: "Enter Bank Name",
        error: "Invalid Bank Name",
        pattern: /^[^]+$/,
        slug: 'bank_name',
        autoCapitalize: "characters",
        disabled: true,
        required: true,
    },
    MICR_CODE: {
        type: "text",
        pattern: /^[0-9]{9}$/,
        title: "Enter MICR Code",
        error: "Invalid MICR Code",
        autoCapitalize: "characters",
        id: "micrCode",
        slug: 'micr_code',
        required: false,
        disabled: true,
    },
    BRANCH_NAME: {
        type: "text",
        title: "Enter Branch Name",
        error: "Invalid Branch Name",
        id: "nameBranch",
        slug: 'branch_name',
        pattern: /^[^]+$/,
        required: true,
        disabled: true,
    }
};

export {bankValidations};