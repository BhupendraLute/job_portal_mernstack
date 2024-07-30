export default function checkResumeFormat  ( resumeLocalPath ) {
    if (!resumeLocalPath.endsWith(".pdf")) {
        throw new ApiError(400, "Resume file should be in pdf format")
        // check resume size is less than 5mb
    } else if (resumeLocalPath.size > 5 * 1024 * 1024) {
        throw new ApiError(400, "Resume file size should be less than 5mb")
    }

    return true
}