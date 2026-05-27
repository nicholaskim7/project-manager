function generateSlug(projectName) {
    return projectName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
}

module.exports = { generateSlug };