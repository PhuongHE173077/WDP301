const { google } = require("googleapis")

const SCOPES = ['https://www.googleapis.com/auth/drive'];

const fs = require('fs');
import apikeys from "../../google_apikey.json"
import streamifier from "streamifier";


// Function to authorize and get access to Google Drive API
async function authorize() {
    const auth = new google.auth.JWT(
        apikeys.client_email,
        null,
        apikeys.private_key,
        SCOPES
    );

    try {
        await auth.authorize();
        return auth;
    } catch (error) {
        throw new Error(`Error authorizing Google Drive API: ${error.message}`);
    }
}
async function listFiles(auth) {
    const drive = google.drive({ version: 'v3', auth });

    try {
        const response = await drive.files.list({
            pageSize: 10,
            fields: 'nextPageToken, files(id, name)',
        });

        const files = response.data.files;
        if (files.length) {
            console.log('Available files:');
            files.forEach(file => {
                console.log(`${file.name} (${file.id})`);
            });
        } else {
            console.log('No files found.');
        }
    } catch (error) {
        throw new Error(`Error listing files in Google Drive: ${error.message}`);
    }
}

async function uploadFile(auth, fileBuffer, fileName, folderId) {
    const drive = google.drive({ version: 'v3', auth });

    const fileMetadata = {
        name: fileName, // Extract file name from path
        parents: [folderId] // Folder ID to upload the file into
    };

    const media = {
        mimeType: 'application/octet-stream',
        body: streamifier.createReadStream(fileBuffer)
    };

    try {
        const response = await drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: 'id'
        });

        console.log('File uploaded successfully. File ID:', response.data.id);
        return response.data;
    } catch (error) {
        throw new Error(`Error uploading file to Google Drive: ${error.message}`);
    }
}
async function deleteFile(auth, fileId) {
    const drive = google.drive({ version: 'v3', auth });

    try {
        await drive.files.delete({
            fileId: fileId
        });

        console.log('File deleted successfully.');
    } catch (error) {
        throw new Error(`Error deleting file from Google Drive: ${error.message}`);
    }
}


export const googleDriveProvider = {
    authorize,
    uploadFile
}
