import {BASE_URL} from '../../config'

export default async function performLogin(username,password){

    if(username != null && password != null)
        {
            const loginModel = {Username : username, Password: password};
            try{
                const response = await fetch(`${BASE_URL}/Authenticate/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(loginModel)
                });
                if (!response.ok)
                    {
                        throw new Error(`Login failed with status: ${response.status}`)
                    }
                const data = await response.json();
                if(data)
                    {
                        // // console.log(data.token);
                        // // console.log(data.expiration)
                        // // console.log(data.user)
                        // sessionStorage.setItem('jwtToken',data.token);
                        // sessionStorage.setItem('userInfo',JSON.stringify(data.user));
                        // sessionStorage.setItem('jwtExpiration',data.expiration)                        
                        // return true;
                        return data;
                    }
                else {
                    throw new Error('Invalid login credentials!');
                    }
            }catch(error)
            {
                console.log('login error:' + error);           
            }
        }
}

