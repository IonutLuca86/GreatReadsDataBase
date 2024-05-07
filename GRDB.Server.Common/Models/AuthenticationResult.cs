using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GRDB.Server.Common.Models
{
    public class AuthenticationResult
    {
        public string Token { get; set; }
        public DateTime Expiration { get; set; }
        public LoggedUser User { get; set; }
    }
 
}
