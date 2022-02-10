using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(PosterForm.Startup))]
namespace PosterForm
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
