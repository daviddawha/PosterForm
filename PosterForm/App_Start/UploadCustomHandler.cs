using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PosterForm.App_Start
{
    public class UploadCustomHandler : IHttpHandler
    {
        public bool IsReusable { get { return true; } }

        public void ProcessRequest(HttpContext context)
        {
            throw new NotImplementedException();
        }
    }
}