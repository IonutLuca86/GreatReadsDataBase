using Azure.Storage.Blobs.Models;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Specialized;
using CsvHelper;
using CsvHelper.Configuration;
using GRDB.Server.Common.DTOs;
using GRDB.ServerAPI.Entities;
using GRDB.ServerAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Formats.Asn1;
using System.Globalization;
using System.Security.Cryptography;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using SixLabors.ImageSharp.Formats;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp;

namespace GRDB.ServerAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BaseDataUpload : ControllerBase
    {
        private readonly IDbService _db;       
        private readonly BlobServiceClient _blobServiceClient;
        public BaseDataUpload(IDbService db, HttpClient client,BlobServiceClient blobServiceClient)
        {
            _db = db;        
            _blobServiceClient = blobServiceClient;
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> UploadBaseData(IFormFile csvFile)
        {
            try
            {      
                var records = await GetFileContent(csvFile);
                foreach (var record in records)
                    {
                        if (record.BookISBN == null || record.Title == null || record.Authors == null || record.CoverUrl == null)
                            continue;
                        else
                        {
                            using (var client = new HttpClient())
                            {
                                var coverUrl = await UploadImage(record.CoverUrl,client);
                                if (coverUrl == null)
                                    continue;
                                else
                                {
                                    var book = new BookDTO
                                    {
                                        ISBN = record.BookISBN,
                                        Title = record.Title,
                                        Publisher = record.Publisher,
                                        PublishedDate = record.PublishedDate,
                                        Language = record.Language,
                                        CoverUrl = coverUrl, 
                                        BookUrl = record.BookLink,
                                        UserId = 1
                                    };
                                    var bookEntity = await _db.AddAsync<Book, BookDTO>(book);
                                    var result = await _db.SaveChangesAsync();
                                    if (!result)
                                    {
                                        return StatusCode(StatusCodes.Status500InternalServerError, "Failed to save the book");
                                    }
                                    else
                                    {
                                        var authors = record.Authors.Split(",");
                                        foreach (var author in authors)
                                        {
                                            var authorEntity = await _db.GetAsync<BookAuthor, AuthorDTO>(x => x.AuthorName == author);
                                            if (authorEntity == null)
                                            {
                                                var newAuthor = new AuthorCreateDTO { AuthorName = author, BirthDate = null, WorkCount = null };
                                                var newauthorEntity = await _db.AddAsync<BookAuthor, AuthorCreateDTO>(newAuthor);
                                                result = await _db.SaveChangesAsync();
                                                if (!result)
                                                {
                                                    return StatusCode(StatusCodes.Status500InternalServerError, "Failed to save the author");
                                                }
                                                else
                                                {
                                                    var connection = new BookAuthorConnectionDTO
                                                    {
                                                        BookId = bookEntity.Id,
                                                        AuthorId = newauthorEntity.Id
                                                    };
                                                    var connectionEntity = await _db.AddConnectionAsync<BookAuthorConnection, BookAuthorConnectionDTO>(connection);
                                                    result = await _db.SaveChangesAsync();
                                                    if (!result)
                                                    {
                                                        return StatusCode(StatusCodes.Status500InternalServerError, "Failed to save the connection");
                                                    }
                                                }
                                            }
                                        else
                                        {
                                            var connection = new BookAuthorConnectionDTO
                                            {
                                                BookId = bookEntity.Id,
                                                AuthorId = authorEntity.Id
                                            };
                                            var connectionEntity = await _db.AddConnectionAsync<BookAuthorConnection, BookAuthorConnectionDTO>(connection);
                                            result = await _db.SaveChangesAsync();
                                            if (!result)
                                            {
                                                return StatusCode(StatusCodes.Status500InternalServerError, "Failed to save the connection");
                                            }
                                        }

                                        }
                                        var genres = record.Category;
                                        
                                            var genreEntity = await _db.GetAsync<BookGenre, GenreDTO>(x => x.Name == genres);
                                            if (genreEntity == null)
                                            {
                                                var newGenre = new GenreDTO { Name = genres };
                                                var newGenreEntity = await _db.AddAsync<BookGenre, GenreDTO>(newGenre);
                                                result = await _db.SaveChangesAsync();
                                                if (!result)
                                                {
                                                    return StatusCode(StatusCodes.Status500InternalServerError, "Failed to save the genre");
                                                }
                                                else
                                                {
                                                    var connection = new BookGenreConnectionDTO
                                                    {
                                                        BookId = bookEntity.Id,
                                                        GenreId = newGenreEntity.Id
                                                    };
                                                    var connectionEntity = await _db.AddConnectionAsync<BookGenreConnection, BookGenreConnectionDTO>(connection);
                                                    result = await _db.SaveChangesAsync();
                                                    if (!result)
                                                    {
                                                        return StatusCode(StatusCodes.Status500InternalServerError, "Failed to save the connection");
                                                    }
                                                }
                                            }
                                        else
                                        {
                                            var connection = new BookGenreConnectionDTO
                                            {
                                                BookId = bookEntity.Id,
                                                GenreId = genreEntity.Id
                                            };
                                            var connectionEntity = await _db.AddConnectionAsync<BookGenreConnection, BookGenreConnectionDTO>(connection);
                                            result = await _db.SaveChangesAsync();
                                            if (!result)
                                            {
                                                return StatusCode(StatusCodes.Status500InternalServerError, "Failed to save the connection");
                                            }
                                        }
                                        
                                    }
                                }

                            }   

                        
                    }
                }
                return Ok("Data uploaded successfully");
            }
            catch(Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Failed to upload the data"+ex);
            }
        }

        private async Task<string> UploadImage(string url,HttpClient _client)
        {
            try
            {
                var response = await _client.GetAsync(url);
                if (!response.IsSuccessStatusCode)
                {
                    throw new Exception("Failed to download the image");
                }

                var imageBytes = await response.Content.ReadAsByteArrayAsync();
                using (var inputStream = new MemoryStream(imageBytes))
                {
                    var containerClient = _blobServiceClient.GetBlobContainerClient("coverimages");
                    if (!await containerClient.ExistsAsync())
                    {
                        await containerClient.CreateAsync();
                    }                 
                    var publicAccess = PublicAccessType.Blob;
                    await containerClient.SetAccessPolicyAsync(publicAccess);

                    var extension = GetImageExtensionFromContent(imageBytes);
                    var fileName = $"{Guid.NewGuid()}{extension}";

                    var blockBlobClient = containerClient.GetBlockBlobClient(fileName);
                    inputStream.Position = 0; 

                    var contentType = GetContentTypeFromExtension(extension);
                    await blockBlobClient.UploadAsync(inputStream, new BlobHttpHeaders { ContentType = contentType });

                    var blobClient = containerClient.GetBlobClient(fileName);
                    return blobClient.Uri.ToString();
                }
            }
            catch (Exception ex)
            {
                return null;
                throw new Exception("Error uploading image: " + ex.Message);
            }
        }
        private async Task<List<CsvTemplate>> GetFileContent(IFormFile file)
        {
            var records = new List<CsvTemplate>();

            using (var reader = new StreamReader(file.OpenReadStream()))
            {

                await reader.ReadLineAsync();

                string line;
                while ((line = await reader.ReadLineAsync()) != null)
                {
                    var values = line.Split(';');

                    records.Add(new CsvTemplate
                    {
                        BookISBN = values[0],
                        Title = values[1],
                        Authors = values[2],
                        Publisher = values[3],
                        PublishedDate = values[4],
                        Category = values[5],
                        Language = values[6],
                        CoverUrl = values[7],
                        BookLink = values[8],
                    });
                }
            }
                return records;
        }

        private static async Task<byte[]> StoreFile(BlockBlobClient blockClient, Stream inputStream)
        {
            var hasher = MD5.Create();
            await using (var storageStream = await blockClient.OpenWriteAsync(true))
            await using (var cryptoStream = new CryptoStream(storageStream, hasher, CryptoStreamMode.Write))
            {
                await inputStream.CopyToAsync(cryptoStream);
            }
            return hasher.Hash;
        }

       
        private string GetImageExtensionFromContent(byte[] imageBytes)
        {
            if (imageBytes.Length < 2)
            {
                return ""; 
            }
           
            if (imageBytes[0] == 0xFF && imageBytes[1] == 0xD8)
            {
                return ".jpg";
            }
            else if (imageBytes[0] == 0x89 && imageBytes[1] == 'P' && imageBytes[2] == 'N' && imageBytes[3] == 'G')
            {
                return ".png";
            }
            else if (imageBytes[0] == 0x47 && imageBytes[1] == 'I' && imageBytes[2] == 'F')
            {
                return ".gif";
            }
            else
            {             
                return "";
            }
        }

  
        private string GetContentTypeFromExtension(string extension)
        {
            switch (extension.ToLower())
            {
                case ".jpg":
                case ".jpeg":
                    return "image/jpeg";
                case ".png":
                    return "image/png";
                case ".gif":
                    return "image/gif";
                default:
                    return "application/octet-stream"; 
            }
        }


    }


    public class CsvTemplate
    {
        public  string BookISBN { get; set; }
        public string Title { get; set; }
        public string Authors { get; set; }
        public string Publisher { get; set; }
        public string PublishedDate { get; set; }
        public string Category { get; set; }
        public string Language { get; set; }
        public string CoverUrl { get; set; }  
        public string BookLink { get; set; }

    }   
  
}
