const file_catalog = {
    id_proof: ['pan', 'aadhaar', 'passport', 'driving_license', 'voterid'],
    add_proof: ['aadhaar', 'driving_license', 'electricity_bill', 'gas_bill', 'passport', 'rent_agreement', 'property_tax', 'voterid'],
    entity_proof: ['ghumasta_license', 'gst_certificate', 'other_govt_reg', 'st_vat_cst_registration'],
    caddr_proof: ['electricity_bill', 'rent_agreement']
};

const doc_att = [
    {doc_type: 'pan', doc_category: 'kyc', doc_owner: 'user'},
    {doc_type: 'electricity_bill', doc_category: 'address', doc_owner: 'user'},
    {doc_type: 'gst_certificate', doc_category: 'entity_proof', doc_owner: 'company'},
    {doc_type: 'rent_agreement', doc_category: 'address', doc_owner: 'company'},
];

const doc_type_attr = [
    'id_proof',
    'add_proof',
    'entity_proof',
    'caddr_proof'
];

export {file_catalog, doc_att, doc_type_attr};