export default class IsMobile {
    constructor() {
        this.isMobile = false;
        this.isMobile = this.check();
    }

    check() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
}