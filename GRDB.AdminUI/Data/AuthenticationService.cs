
using GRDB.Server.Common.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Authorization;
using Microsoft.JSInterop;
using System.Globalization;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text.Json;

namespace GRDB.AdminUI.Data
{
    public class AuthenticationService : ComponentBase,IAuthenticationService
    {
        private readonly IJSRuntime _jsRuntime;
        public const string UserKey = "currentUser";
        public bool isAuthenticated { get; set;}
        public event Action<AuthenticationState> AuthenticationStateChanged;

        public AuthenticationService(IJSRuntime jsRuntime)
        {
            _jsRuntime = jsRuntime;
        }
        private void NotifyAuthenticationStateChanged(AuthenticationState state)
        {
            AuthenticationStateChanged?.Invoke(state);
        }
      
        public async Task Authenticate()
        {
            var token = await GetAccessToken();
            var tokenExpiration = await GetTokenExpiration();

            if (string.IsNullOrEmpty(token) || (tokenExpiration != null && tokenExpiration < DateTime.UtcNow))
            {
                isAuthenticated = false;
            }
            else
            {
                isAuthenticated = true;
            }
        }
        public async Task<DateTime?> GetTokenExpiration()
        {
            string token = await GetAccessToken();
            if (string.IsNullOrEmpty(token))
            {
                return null;
            }

            try
            {
                var handler = new JwtSecurityTokenHandler();
                var jsonToken = handler.ReadToken(token) as JwtSecurityToken;

                if (jsonToken != null && jsonToken.Payload.TryGetValue("exp", out var exp))
                {
                    long expUnixTime = Convert.ToInt64(exp);
                    return DateTimeOffset.FromUnixTimeSeconds(expUnixTime).DateTime;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error parsing JWT token: {ex.Message}");
            }

            return null;
        }


        public async Task<string> GetAccessToken()
        {
            return await _jsRuntime.InvokeAsync<string>("sessionStorage.getItem", "token");
        }

        public async Task Login(string token, LoggedUser user)
        {
            
            await _jsRuntime.InvokeVoidAsync("sessionStorage.setItem", "token", token);
            await _jsRuntime.InvokeVoidAsync("sessionStorage.setItem", UserKey, JsonSerializer.Serialize(user));
         
            isAuthenticated = true;
     
        }

        public async Task Logout()
        {
            await _jsRuntime.InvokeVoidAsync("sessionStorage.removeItem", "token");
            await _jsRuntime.InvokeVoidAsync("sessionStorage.removeItem", UserKey);
            isAuthenticated = false;
            NotifyAuthenticationStateChanged(new AuthenticationState(new ClaimsPrincipal(new ClaimsIdentity())));
        }
    
    

        public async Task<LoggedUser> GetUser()
        {
            var userDataJson = await _jsRuntime.InvokeAsync<string>("sessionStorage.getItem", UserKey);
            if (!string.IsNullOrEmpty(userDataJson))
            {
                return JsonSerializer.Deserialize<LoggedUser>(userDataJson);
            }
            return null;
        }
    }
}
