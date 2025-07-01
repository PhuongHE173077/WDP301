import { pick } from "lodash"

export const pickUser = (user) => {
    if (!user) return {}
    return pick(user, ['_id', 'email', 'userName', 'displayName', 'avatar', 'role', 'isActive', 'address', 'phone', 'timeExpired', 'dateOfBirth', 'CCCD'])
}

export function generateOTPs(count = 5, length = 6) {
    const otps = [];
    for (let i = 0; i < count; i++) {
        let otp = '';
        for (let j = 0; j < length; j++) {
            otp += Math.floor(Math.random() * 10);
        }
        otps.push(otp);
    }
    return otps;
}
