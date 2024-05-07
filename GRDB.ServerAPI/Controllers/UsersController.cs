
using GRDB.Server.Common.DTOs;
using GRDB.ServerAPI.Entities;
using GRDB.ServerAPI.Services;
using Microsoft.AspNetCore.Mvc;

namespace GRDB.ServerAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IDbService _db;
        public UsersController(IDbService db)
        {
            _db = db;
        }

        /// <summary>
        /// List all users
        [HttpGet]
        public async Task<IActionResult> ListAllUsers()
        {
            try
            {
                var users = await _db.GetAllAsync<GrdbUser, GrdbUserDTO>();
                return Ok(users);
            }
            catch { return NotFound("No items were found!"); }
        }

        /// <summary>
        /// List single user info by id
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(int id)
        {
            try
            {
                var user = await _db.GetAsync<GrdbUser, GrdbUserDTO>(x => x.Id == id);
                return Ok(user);
            }
            catch { return NotFound("No items were found!"); }
        }

        ///summary
        /// Get all books added by a user
        [HttpGet("{int id}/books")]
        public async Task<IActionResult> GetBooksByUser(int userId)
        {
            var books = await _db.GetAllAsyncbyId<Book, BookDTO>(x => x.UserId == userId);
            return Ok(books);
        }

        ///summary
        /// Add a new user
        [HttpPost]
        public async Task<IActionResult> InsertUser([FromBody] GrdbUserCreateDTO user)
        {
            try
            {
                var newUser = await _db.AddAsync<GrdbUser, GrdbUserCreateDTO>(user);
                var result = await _db.SaveChangesAsync();
                if (!result)
                    return BadRequest();
                else
                    return Created($"api/{typeof(GrdbUser).Name.ToLower()}s/{newUser.Id}", newUser);
            }
            catch { return BadRequest(); }
        }


        ///summary
        /// Update an user info by id
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] GrdbUserUpdateDTO dto)
        {
            try
            {
                if (!await _db.AnyAsync<GrdbUser>(x => x.Id.Equals(id)))
                    return NotFound();

                _db.UpdateAsync<GrdbUser, GrdbUserUpdateDTO>(id, dto);
                if (await _db.SaveChangesAsync())
                    return NoContent();
            }
            catch { return BadRequest("Update failed!"); }
            return BadRequest("Update failed!");
        }

        ///summary
        /// Delete user by id <summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            try
            {
                if (!await _db.DeleteAsync<GrdbUser>(id))
                    return NotFound();
                if (await _db.SaveChangesAsync())
                    return NoContent();
            }
            catch { return BadRequest("User not found!"); }
            return BadRequest("User not found!");
        }
    }
}
