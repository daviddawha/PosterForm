using System.Web;
using System.Web.Optimization;

namespace PosterForm
{
    public class BundleConfig
    {
        // For more information on bundling, visit https://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at https://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/site.css"));

            bundles.Add(new ScriptBundle("~/bundles/dropzonescripts").Include(
                     "~/Scripts/dropzone/dropzone.js"));

            bundles.Add(new StyleBundle("~/Content/dropzonescss").Include(
                     "~/Scripts/dropzone/basic.css",
                     "~/Scripts/dropzone/dropzone.css"));

            bundles.Add(new StyleBundle("~/Content/jqueryfileupload").Include(
                "~/Content/jQuery.FileUpload/css/jquery.fileupload.css",
                "~/Content/jQuery.FileUpload/css/jquery.fileupload-ui.css"));

            bundles.Add(new StyleBundle("~/bundles/jqueryfileupload").Include(
                "~/Scripts/jQuery.FileUpload/jquery-fileupload-audio.js",
                "~/Scripts/jQuery.FileUpload/jquery-fileupload-image.js",
                "~/Scripts/jQuery.FileUpload/jquery-fileupload-process.js",
                "~/Scripts/jQuery.FileUpload/jquery-fileupload-ui.js",
                "~/Scripts/jQuery.FileUpload/jquery-fileupload-validate.js",
                "~/Scripts/jQuery.FileUpload/jquery-fileupload-video.js",
                "~/Scripts/jQuery.FileUpload/jquery-fileupload.js",
                "~/Scripts/jQuery.FileUpload/jquery.iframe-transport.js",
                "~/Scripts/jQuery.FileUpload/cors/jquery.postmessage-transport.js",
                "~/Scripts/jQuery.FileUpload/cors/jquery.xdr-transport.js"));
        }
    }
}
