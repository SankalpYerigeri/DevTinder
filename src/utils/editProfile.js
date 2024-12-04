const validateEditProfile = (req) =>
{
    const allowedFieldEdits = ["firstName", "lastName", "emailId", "age", "gender"]

    const isEditAllowed = Object.keys(req.body).every(field => allowedFieldEdits.includes(field));

    return isEditAllowed;
}

module.exports = validateEditProfile;