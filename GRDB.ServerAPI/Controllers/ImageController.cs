using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Azure.Storage.Blobs.Specialized;
using Azure.Storage.Sas;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography;
using System.Threading;
using static System.Net.WebRequestMethods;

namespace GRDB.ServerAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ImageController : ControllerBase
    {

        private readonly BlobServiceClient _blobServiceClient;
        public ImageController(BlobServiceClient blobServiceClient)
        {
            //_blobServiceClient = new BlobServiceClient("DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;BlobEndpoint=http://storage:10000/devstoreaccount1;QueueEndpoint=http://storage:10001/devstoreaccount1;");
            _blobServiceClient = blobServiceClient;
        }
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Upload(IFormFile file)
        {
            try
            {
                string extension = Path.GetExtension(file.FileName);
                await using var openReadStream = file.OpenReadStream();
                await using var inputStream = new MemoryStream();
                await openReadStream.CopyToAsync(inputStream);
                var fileSize = inputStream.Length;
                inputStream.Position = 0;
                var fileName = $"{Guid.NewGuid()}{extension}";         
               
                var containerClient = _blobServiceClient.GetBlobContainerClient("coverimages");        
                if (!await containerClient.ExistsAsync())
                {
                    await containerClient.CreateAsync();
                }

                var publicAccess = PublicAccessType.Blob; 
                await containerClient.SetAccessPolicyAsync(publicAccess);

                var blockBlobClient = containerClient.GetBlockBlobClient(fileName);
                var contentHash = await StoreFile(blockBlobClient, inputStream);
                var blobClient = containerClient.GetBlobClient(fileName);


                return Ok(blobClient.Uri);


            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
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

    }
}
