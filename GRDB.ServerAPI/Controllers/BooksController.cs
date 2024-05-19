
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
        public async Task<List<CompleteBookInfo>> ListAllBooks()
        {
            try
            {
                _db.Include<BookAuthorConnection>();
                _db.Include<BookGenreConnection>();
                _db.Include<GrdbUser>();
                var books = await _db.GetAllAsync<Book, BookDTO>();
                var booksComplete = new List<CompleteBookInfo>();
                foreach(var book in books)
                {
                    var rewiews = await _db.GetAllAsyncbyId<BookReview, BookReviewDTO>(r => r.BookId == book.Id);
                    var completeBookInfo = new CompleteBookInfo
                    {
                        Id = book.Id,
                        ISBN = book.ISBN,
                        Title = book.Title,
                        Publisher = book.Publisher,
                        PublishedDate = book.PublishedDate,
                        Language = book.Language,
                        CoverUrl = book.CoverUrl,
                        BookUrl = book.BookUrl,
                        User = book.User,
                        UserId = book.UserId,
                        Authors = book.Authors,
                        BookGenres = book.BookGenres,
                        BookReviews = rewiews
                    };
                    booksComplete.Add(completeBookInfo);
                }
                return booksComplete;
            }
            catch { throw; }
       
        }

        /// <summary>
        /// List all books
        [HttpGet("{id:int}")]
        public async Task<CompleteBookInfo> GetBook(int id)
        {
            try
            {
                _db.Include<BookAuthorConnection>();
                _db.Include<BookGenreConnection>();
                _db.Include<GrdbUser>();         
                var book = await _db.GetAsync<Book, BookDTO>(x => x.Id == id);
                var reviews = await _db.GetAllAsyncbyId<BookReview, BookReviewDTO>(r => r.BookId == id);
                var completeBookInfo = new CompleteBookInfo
                {
                    Id = book.Id,
                    ISBN = book.ISBN,
                    Title = book.Title,
                    Publisher = book.Publisher,
                    PublishedDate = book.PublishedDate,
                    Language = book.Language,
                    CoverUrl = book.CoverUrl,
                    BookUrl = book.BookUrl,
                    User = book.User,
                    UserId = book.UserId,
                    Authors = book.Authors,
                    BookGenres = book.BookGenres,
                    BookReviews = reviews

                };

                return completeBookInfo;
            }
            catch { throw; }
     
        }

        /// <summary>
        /// List all books for a specific user
        [HttpGet("{id}/userbooks")]
        public async Task<IActionResult> ListAllBooksbyUser(int id)
        {
            try
            {
                _db.Include<BookAuthorConnection>();
                _db.Include<BookGenreConnection>();
                _db.Include<GrdbUser>();          
                var books = await _db.GetAllAsyncbyId<Book, BookDTO>(r => r.UserId == id);
                var completeBooks = new List<CompleteBookInfo>();
                foreach (var book in books)
                {
                    var rewiews = await _db.GetAllAsyncbyId<BookReview, BookReviewDTO>(r => r.BookId == book.Id);
                    var completeBookInfo = new CompleteBookInfo
                    {
                        Id = book.Id,
                        ISBN = book.ISBN,
                        Title = book.Title,
                        Publisher = book.Publisher,
                        PublishedDate = book.PublishedDate,
                        Language = book.Language,
                        CoverUrl = book.CoverUrl,
                        BookUrl = book.BookUrl,
                        User = book.User,
                        UserId = book.UserId,
                        Authors = book.Authors,
                        BookGenres = book.BookGenres,
                        BookReviews = rewiews
                    };
                    completeBooks.Add(completeBookInfo);
                }
                return Ok(completeBooks);
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
