
using GRDB.Server.Common.Models;
using GRDB.ServerAPI.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Security.Cryptography.X509Certificates;
using System.Text;

namespace GRDB.ServerAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticateController : ControllerBase
    {
        private readonly UserManager<GrdbUser> _userManager;
        private readonly RoleManager<IdentityRole<int>> _roleManager;
        private readonly IConfiguration _configuration;


        public AuthenticateController(
            UserManager<GrdbUser> userManager,
            RoleManager<IdentityRole<int>> roleManager,
            IConfiguration configuration)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _configuration = configuration;

        }

        [HttpPost]
        [Route("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            var user = await _userManager.FindByNameAsync(model.Username);
            if (user != null && await _userManager.CheckPasswordAsync(user, model.Password))
            {
                var userRoles = await _userManager.GetRolesAsync(user);

                var authClaims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, user.UserName),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                };

                foreach (var userRole in userRoles)
                {
                    authClaims.Add(new Claim(ClaimTypes.Role, userRole));
                }

                if (authClaims.Count > 0)
                {
                    var (token,valitTo) = GetToken(authClaims);

                    return Ok(new AuthenticationResult
                    {
                        Token = token,
                        Expiration = valitTo,
                        User = new LoggedUser
                        {
                            Id = user.Id,
                            Username = user.UserName,
                            Email = user.Email,
                            Roles = (List<string>)userRoles
                        }
                    });
                }
            }
            return Unauthorized();
        }

        [HttpPost]
        [Route("register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            var userExists = await _userManager.FindByNameAsync(model.Username);
            if (userExists != null)
                return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = "Error", Message = "User already exists!" });

            GrdbUser user = new()
            {
                Email = model.Email,
                SecurityStamp = Guid.NewGuid().ToString(),
                UserName = model.Username,
            };
            var result = await _userManager.CreateAsync(user, model.Password);
            if (!result.Succeeded)
                return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = "Error", Message = "User creation failed! Please check user details and try again." });
            if (!await _roleManager.RoleExistsAsync(UserRoles.User))
                await _roleManager.CreateAsync(new IdentityRole<int>(UserRoles.User));

            return Ok(new Response { Status = "Success", Message = "User created successfully!" });
        }


        //[Authorize(Roles = "Admin")]
        [HttpPost]
        [Route("register-admin")]
        public async Task<IActionResult> RegisterAdmin([FromBody] RegisterModel model)
        {
            var userExists = await _userManager.FindByNameAsync(model.Username);
            if (userExists != null)
                return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = "Error", Message = "User already exists!" });

            GrdbUser user = new()
            {
                Email = model.Email,
                SecurityStamp = Guid.NewGuid().ToString(),
                UserName = model.Username
            };
            var result = await _userManager.CreateAsync(user, model.Password);
            if (!result.Succeeded)
                return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = "Error", Message = "User creation failed! Please check user details and try again." });

            if (!await _roleManager.RoleExistsAsync(UserRoles.Admin))
                await _roleManager.CreateAsync(new IdentityRole<int>(UserRoles.Admin));
            if (!await _roleManager.RoleExistsAsync(UserRoles.User))
                await _roleManager.CreateAsync(new IdentityRole<int>(UserRoles.User));

            if (await _roleManager.RoleExistsAsync(UserRoles.Admin))
            {
                await _userManager.AddToRoleAsync(user, UserRoles.Admin);
            }
            if (await _roleManager.RoleExistsAsync(UserRoles.Admin))
            {
                await _userManager.AddToRoleAsync(user, UserRoles.User);
            }
            return Ok(new Response { Status = "Success", Message = "User created successfully!" });
        }

        private (string,DateTime) GetToken(List<Claim> authClaims)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:SecretKey"]));
            var algorithm = SecurityAlgorithms.HmacSha256;       

            var creds = new SigningCredentials(key, algorithm);
            var tokendescriptor = new SecurityTokenDescriptor
            {
                Issuer = _configuration["JWT:ValidIssuer"],
                Audience = _configuration["JWT:ValidAudience"],
                Subject = new ClaimsIdentity(authClaims),
                Expires = DateTime.UtcNow.AddHours(24),
                SigningCredentials = creds
            };
            var tokenobject = new JwtSecurityTokenHandler().CreateToken(tokendescriptor);
            var token = new JwtSecurityTokenHandler().WriteToken(tokenobject);

            return (token,tokenobject.ValidTo);

        }
        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userManager.Users.Select(u => new LoggedUser
            {
                Id = u.Id,
                Username = u.UserName,
                Email = u.Email,
                Roles = _userManager.GetRolesAsync(u).Result.ToList()
            }).ToListAsync();
            return Ok(users);
        }


        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await _userManager.FindByIdAsync(id.ToString());
            if (user == null)
                return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = "Error", Message = "User not found!" });

            var userRoles = await _userManager.GetRolesAsync(user);
            var loggedUser = new LoggedUser
            {
                Id = user.Id,
                Username = user.UserName,
                Email = user.Email,
                Roles = (List<string>)userRoles
            };
            return Ok(loggedUser);
        }

        [Authorize]
        [HttpPatch("{id}")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordModel model)
        {
            var user = await _userManager.FindByIdAsync(model.Id.ToString());
            if (user == null)
                return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = "Error", Message = "User not found!" });

            var result = await _userManager.ChangePasswordAsync(user, model.CurrentPassword, model.NewPassword);
            if (!result.Succeeded)
                return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = "Error", Message = "Password change failed! Please check user details and try again." });

            return Ok(new Response { Status = "Success", Message = "Password changed successfully!" });
        }

        [Authorize]
        [HttpPatch("{id}/roles")]
        public async Task<IActionResult> AddRole(int id, [FromBody] string role)
        {
            var user = await _userManager.FindByIdAsync(id.ToString());
            if (user == null)
                return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = "Error", Message = "User not found!" });
            var currentRoles = await _userManager.GetRolesAsync(user);
            if (currentRoles.Contains("Admin") && role.Equals("User"))
            {                
                await _userManager.RemoveFromRoleAsync(user, "Admin");
            }

            var result = await _userManager.AddToRoleAsync(user, role);
            if (!result.Succeeded)
                return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = "Error", Message = "Role addition failed! Please check user details and try again." });

            return Ok(new Response { Status = "Success", Message = "Role added successfully!" });
        }

        [Authorize]
        [HttpDelete("{id}")]
         public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _userManager.FindByIdAsync(id.ToString());
            if (user == null)
                return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = "Error", Message = "User not found!" });

            var result = await _userManager.DeleteAsync(user);
            if (!result.Succeeded)
                return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = "Error", Message = "User deletion failed! Please check user details and try again." });

            return Ok(new Response { Status = "Success", Message = "User deleted successfully!" });
        }
    }
}
