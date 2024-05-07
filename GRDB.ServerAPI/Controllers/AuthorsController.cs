
using GRDB.Server.Common.DTOs;
using GRDB.ServerAPI.Entities;
using GRDB.ServerAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GRDB.ServerAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthorsController : ControllerBase
    {
        private readonly IDbService _db;

        public AuthorsController(IDbService db)
        {
            _db = db;
        }
        /// <summary>
        /// List all authors
        [HttpGet]
        public async Task<List<AuthorDTO>> ListAllAuthors()
        {
            try
            {
                var authors = await _db.GetAllAsync<BookAuthor, AuthorDTO>();
                return authors;
            }
            catch
            {
                throw;
            }
        }


        /// <summary>
        /// List single author info by author id
        [HttpGet("{id}")]
        public async Task<AuthorDTO> GetAuthor(int id)
        {
            try
            {
                var author = await _db.GetAsync<BookAuthor, AuthorDTO>(x => x.Id == id);
                return author;
            }
            catch { return new AuthorDTO(); }
        }

        ///summary
        /// Get all books written by an author by id
        [HttpGet("{int id}/books")]
        public async Task<IActionResult> GetBooksByAuthor(int authorId)
        {
            var books = await _db.ConnectionGetAsync<BookAuthorConnection, BookDTO>(x => x.AuthorId == authorId);
            return Ok(books);
        }

        ///summary
        /// Add a new author <summary>
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> InsertAuthor([FromBody] AuthorCreateDTO author)
        {
            try
            {
                var newAuthor = await _db.AddAsync<BookAuthor, AuthorCreateDTO>(author);
                var result = await _db.SaveChangesAsync();
                if (!result)
                    return BadRequest();
                else
                    return Created($"api/{typeof(BookAuthor).Name.ToLower()}s/{newAuthor.Id}", newAuthor);
            }
            catch { return BadRequest(); }
        }

        ///summary
        /// Update an author info by id <summary>
        /// summary
        /// </summary>
        /// <param name="id"></param>
        /// <param name="dto"></param>
        /// <returns></returns>
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAuthor(int id, [FromBody] AuthorDTO dto)
        {
            try
            {
                if (!await _db.AnyAsync<BookAuthor>(x => x.Id.Equals(id)))
                    return NotFound();

                _db.UpdateAsync<BookAuthor, AuthorDTO>(id, dto);
                if (await _db.SaveChangesAsync())
                    return NoContent();
            }
            catch { return BadRequest("Update failed!"); }
            return BadRequest("Update failed!");
        }

        ///summary
        /// Delete author by id <summary>
        /// summary
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAuthor(int id)
        {
            try
            {
                if (!await _db.DeleteAsync<BookAuthor>(id))
                    return NotFound();
                if (await _db.SaveChangesAsync())
                    return NoContent();
            }
            catch { return BadRequest("Author not found!"); }
            return BadRequest("Author not found!");
        }

    }
}
