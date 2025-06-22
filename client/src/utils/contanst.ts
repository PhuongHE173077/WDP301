export const USER_ROLE = {
    OWNER_1: 'owner1',
    OWNER_2: 'owner2',
    OWNER_3: 'owner3',
    ADMIN: 'admin',
    TENANT: 'tenant'
}

export function getDownloadUrl(cloudinaryUrl) {
    const parts = cloudinaryUrl.split('/upload/');
    const filename = cloudinaryUrl.split('/').pop().split('.')[0];
    return `${parts[0]}/upload/fl_attachment:${filename}/${parts[1]}`;
}