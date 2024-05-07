
using AutoMapper;
using GRDB.Server.Common.DTOs;
using GRDB.ServerAPI.Context;
using GRDB.ServerAPI.Entities;
using GRDB.ServerAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Drawing.Imaging;
using System.Runtime.CompilerServices;
using System.Threading;

namespace GRDB.ServerAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BooksController : ControllerBase
    {
        public readonly IDbService _db;
        private readonly IMapper _mapper;
        private readonly GrdbContext _dbContext;

        public BooksController(IDbService db,IMapper mapper,GrdbContext context)
        {
            _db = db;
            _mapper = mapper;
            _dbContext = context;
        }

        /// <summary>
        /// List all books
        [HttpGet]
        public async Task<List<BookDTO>> ListAllBooks()
        {
            try
            {
                _db.Include<BookAuthorConnection>();
                _db.Include<BookGenreConnection>();
                //_db.Include<BookAuthor>();
                //_db.Include<BookGenre>();
                _db.Include<GrdbUser>();
                var books = await _db.GetAllAsync<Book, BookDTO>();
                return books;
            }
            catch { throw; }
            //  try
            //  {
            //      var books = await _dbContext.Book
            //.Include(b => b.Authors)
            //    .ThenInclude(ba => ba.Id)
            //.Include(b => b.BookGenres)
            //    .ThenInclude(bg => bg.Id)
            //    .Include(b => b.User)
            //.ToListAsync();

            //      return _mapper.Map<List<BookDTO>>(books);
            //  }
            //  catch
            //  {
            //      throw;
            //  }
        }

        /// <summary>
        /// List all books
        [HttpGet("{id:int}")]
        public async Task<BookDTO> GetBook(int id)
        {
            try
            {
                _db.Include<BookAuthor>();
                _db.Include<BookGenre>();
                _db.Include<GrdbUser>();
                var book = await _db.GetAsync<Book, BookDTO>(x => x.Id == id);
                return book;
            }
            catch { throw; }
            //  try
            //  {
            //      var books =  _dbContext.Book
            //.Include(b => b.Authors)
            //    .ThenInclude(ba => ba.Author)
            //.Include(b => b.BookGenres)
            //    .ThenInclude(bg => bg.Genre)
            //.FirstOrDefault(b => b.Id == id);

            //      return _mapper.Map<BookDTO>(books);
            //  }
            //  catch
            //  {
            //      throw;
            //  }
        }

        /// <summary>
        /// List all books for a specific user
        [HttpGet("/{id}/userbooks")]
        public async Task<IActionResult> ListAllReviewsbyUser(int userId)
        {
            try
            {
                _db.Include<BookAuthorConnection>();
                _db.Include<BookGenreConnection>();
                _db.Include<GrdbUser>();
                var reviews = await _db.GetAllAsyncbyId<Book, BookDTO>(r => r.UserId == userId);
                return Ok(reviews);
            }
            catch { return NotFound("No items were found!"); }
        }

        ///summary
        /// add new book
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> InsertBook([FromBody] BookCreateDTO book)
        {
            try
            {              

                var newBook = await _db.AddAsync<Book, BookCreateDTO>(book);
                var result = await _db.SaveChangesAsync();
                if (!result)
                    return BadRequest();
                else
                    return Created($"api/{typeof(Book).Name.ToLower()}s/{newBook.Id}",newBook.Id);
            }
            catch { return BadRequest(); }
        }

  



        ///summary
        /// Update a book by id <summary>
        /// summary
        /// </summary>
        /// <param name="id"></param>
        /// <param name="dto"></param>
        /// <returns></returns>
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBook(int id, [FromBody] BookUpdateDTO dto)
        {
            try
            {
                if (!await _db.AnyAsync<Book>(x => x.Id.Equals(id)))
                    return NotFound();

                _db.UpdateAsync<Book, BookUpdateDTO>(id, dto);
                if (await _db.SaveChangesAsync())
                    return NoContent();
            }
            catch { return BadRequest("Update failed!"); }
            return BadRequest("Update failed!");
        }

        ///summary
        /// Delete book by id <summary>
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBook(int id)
        {
            try
            {
                if (!await _db.DeleteAsync<Book>(id))
                    return NotFound();
                if (await _db.SaveChangesAsync())
                    return NoContent();
            }
            catch { return BadRequest("Book not found!"); }
            return BadRequest("Book not found!");
        }
    }
}
