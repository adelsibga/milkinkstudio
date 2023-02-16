function isMobile() {
    return (/iphone|ipod|android|blackberry|mini|windows\sce|palm|smartphone|iemobile/i.test(navigator.userAgent.toLowerCase()))
}

function isTablet() {
    return (/ipad|android|android 3.0|xoom|sch-i800|playbook|tablet|kindle/i.test(navigator.userAgent.toLowerCase()))
}

function isMobileOrTablet() {
    return isMobile() || isTablet()
}