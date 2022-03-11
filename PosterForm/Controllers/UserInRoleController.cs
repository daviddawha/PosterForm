using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Net;
using System.Web;
using System.Web.Mvc;
using PosterForm.Data;
using PosterForm.Models;

namespace PosterForm.Controllers
{
    public class UserInRoleController : Controller
    {
        private PosterFormConnectionEntities db = new PosterFormConnectionEntities();

        // GET: UserInRoles
        public async Task<ActionResult> Index()
        {
            return View(await db.UserInRole.ToListAsync());
        }

        // GET: UserInRoles/Details/5
        public async Task<ActionResult> Details(string id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            UserInRole userInRole = await db.UserInRole.FindAsync(id);
            if (userInRole == null)
            {
                return HttpNotFound();
            }
            return View(userInRole);
        }

        // GET: UserInRoles/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: UserInRoles/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Create([Bind(Include = "Username")] UserInRole userInRole)
        {
            if (ModelState.IsValid)
            {
                db.UserInRole.Add(userInRole);
                await db.SaveChangesAsync();
                return RedirectToAction("Index");
            }

            return View(userInRole);
        }

        // GET: UserInRoles/Edit/5
        public async Task<ActionResult> Edit(string id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            UserInRole userInRole = await db.UserInRole.FindAsync(id);
            if (userInRole == null)
            {
                return HttpNotFound();
            }
            return View(userInRole);
        }

        // POST: UserInRoles/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Edit([Bind(Include = "Username")] UserInRole userInRole)
        {
            if (ModelState.IsValid)
            {
                db.Entry(userInRole).State = EntityState.Modified;
                await db.SaveChangesAsync();
                return RedirectToAction("Index");
            }
            return View(userInRole);
        }

        // GET: UserInRoles/Delete/5
        public async Task<ActionResult> Delete(string id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            UserInRole userInRole = await db.UserInRole.FindAsync(id);
            if (userInRole == null)
            {
                return HttpNotFound();
            }
            return View(userInRole);
        }

        // POST: UserInRoles/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> DeleteConfirmed(string id)
        {
            UserInRole userInRole = await db.UserInRole.FindAsync(id);
            db.UserInRole.Remove(userInRole);
            await db.SaveChangesAsync();
            return RedirectToAction("Index");
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
