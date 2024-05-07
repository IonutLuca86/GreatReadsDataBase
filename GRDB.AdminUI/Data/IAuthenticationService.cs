

using GRDB.Server.Common.Models;
using Microsoft.AspNetCore.Components.Authorization;

namespace GRDB.AdminUI.Data
{
    public interface IAuthenticationService
    {
        bool isAuthenticated { get; set; }
      
        //void NotifyAuthenticationStateChanged(AuthenticationState state);
        Task Authenticate();
        Task<string> GetAccessToken();
        Task Login(string token, LoggedUser user);
        Task Logout();
        Task<LoggedUser> GetUser();
  
    }
}
