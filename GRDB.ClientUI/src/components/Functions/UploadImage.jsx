import {BASE_URL} from '../../config'

export default async function uploadImage(selectedFile,token) {
    try{
        const formData = new FormData();
                formData.append('file', selectedFile);
        const response = await fetch(`${BASE_URL}/Image`, {
            method: 'POST',
            headers: {            
              'Authorization': `Bearer ${token}`,
        },
        body: formData,
    });
        if (!response.ok)
            {
                throw new Error(`Uploading image failed with status: ${response.status}`)
            }
        const data = await response.json();
        console.log(data);
        return data.replace('storage','localhost');    //remove replace when in production
    }catch(error)
    {
        console.log('upload error:' + error);           
    }
}