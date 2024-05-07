using Blazored.LocalStorage;
using GRDB.Server.Common.Models;
using Microsoft.AspNetCore.Components.Authorization;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Threading.Tasks;
using static System.Runtime.InteropServices.JavaScript.JSType;

public class CustomAuthenticationStateProvider : AuthenticationStateProvider
{
    private readonly ILocalStorageService _localStorage;

    public CustomAuthenticationStateProvider(ILocalStorageService localStorage)
    {
        _localStorage = localStorage;
    }

    public override async Task<AuthenticationState> GetAuthenticationStateAsync()
    {
        var token = await _localStorage.GetItemAsync<string>("authToken");

        if (string.IsNullOrEmpty(token))
        {
            return new AuthenticationState(new ClaimsPrincipal(new ClaimsIdentity()));
        }
        else
        {
            var handler = new JwtSecurityTokenHandler();
            var jsonToken = handler.ReadToken(token) as JwtSecurityToken;
            var exp = jsonToken?.ValidTo;

            if (exp.HasValue && exp.Value < DateTime.UtcNow)
            {
                // Token is expired, log out the user
                await MarkUserAsLoggedOut();
                return new AuthenticationState(new ClaimsPrincipal(new ClaimsIdentity()));
            }
            else
            {
                var claims = new[]
                {
                new Claim(ClaimTypes.Name, "user")
                // Add more claims if needed
            };

                var identity = new ClaimsIdentity(claims, "jwt");

                var user = new ClaimsPrincipal(identity);

                return new AuthenticationState(user);
            }
        }
    }
    public async Task<string> GetTokenAsync()
    {
        return await _localStorage.GetItemAsync<string>("authToken");
    }
    public async Task<bool> IsAuthenticatedAsync()
    {
        var token = await _localStorage.GetItemAsync<string>("authToken");
        return !string.IsNullOrEmpty(token);
    }
    public async Task MarkUserAsAuthenticated(string token)
    {
        await _localStorage.SetItemAsync("authToken", token);
        NotifyAuthenticationStateChanged(GetAuthenticationStateAsync());
    }

    public async Task MarkUserAsLoggedOut()
    {
        await _localStorage.RemoveItemAsync("authToken");
        NotifyAuthenticationStateChanged(GetAuthenticationStateAsync());
    }

    public async Task SessionUserInformation(LoggedUser user)
    {
        await _localStorage.SetItemAsync("currentUser", user);
    }
    public async Task<LoggedUser> GetCurrentUser()
    {
        return await _localStorage.GetItemAsync<LoggedUser>("currentUser");
    }
}


