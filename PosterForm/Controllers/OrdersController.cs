using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Net;
using System.Web;
using System.Web.Mvc;
using PosterForm.Models;
using System.Security.Claims;

namespace PosterForm.Controllers
{
    [Authorize]
    public class OrdersController : Controller
    {
        private PosterFormConnectionEntities db = new PosterFormConnectionEntities();

        // GET: Orders
        public async Task<ActionResult> Index(string sortOrder)
        {
            ViewBag.Department = string.IsNullOrEmpty(sortOrder) ? "DateIN": "";
            ViewBag.UserName = string.IsNullOrEmpty(sortOrder) ? "Username" : "";
            ViewBag.DateIN = sortOrder == "Date" ? "Date_desc" : "Date";
            ViewBag.TotalCost = string.IsNullOrEmpty(sortOrder) ? "DateIN" : "";

            var dateEntered = from x in db.Order select x;
            switch (sortOrder)
            {
                case "Department":
                    dateEntered = dateEntered.OrderByDescending(x => x.Department);
                    break;
                case "UserName":
                    dateEntered = dateEntered.OrderByDescending(x => x.UserName);
                    break;
                case "DateIN":
                    dateEntered = dateEntered.OrderBy(x => x.DateIN);
                    break;
                case "TotalCost":
                    dateEntered = dateEntered.OrderByDescending(x => x.TotalCost);
                    break;
                default:
                    dateEntered = dateEntered.OrderByDescending(x => x.DateIN);
                    break;
            }

            return View(await dateEntered.ToListAsync());
        }

        // GET: MyOrders
        public async Task<ActionResult> MyOrders()
        {
            IOrderedQueryable<Order> orderByResult = from s in db.Order
                                                     orderby s.DateIN descending //Sorts the studentList collection in ascending order
                                                     select s;

            return View(await orderByResult.ToListAsync());

            
        }

        // GET: Receipts
        public async Task<ActionResult> Receipt(int? id)
        {
            var OrderId = id;
            string query = "SELECT * FROM Order WHERE Id = {0}";
            Order order = await db.Order.FindAsync(id);
            Line line = await db.Line.FindAsync(OrderId);

            var model = new FullViewModel
            {

            };


            return View(order);
        }

        // GET: Orders/Details/5
        public async Task<ActionResult> Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Order order = await db.Order.FindAsync(id);
            if (order == null)
            {
                return HttpNotFound();
            }
            return View(order);
        }

        // GET: Orders/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: Orders/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Create([Bind(Include = "Id,Department,UserName,DateIN,TotalCost,Paid,Printed,OperatorOut,FirstName,LastName,Location,Purpose,CustType")] Order order)
        {
            if (ModelState.IsValid)
            {
                order.DateIN = DateTime.Now;
                db.Order.Add(order);
                await db.SaveChangesAsync();
                return RedirectToAction("Index");
            }

            return View(order);
        }

        // GET: Orders/Edit/5
        public async Task<ActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Order order = await db.Order.FindAsync(id);
            if (order == null)
            {
                return HttpNotFound();
            }
            return View(order);
        }

        // POST: Orders/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Edit([Bind(Include = "Id,Department,UserName,DateIN,TotalCost,Paid,Printed,OperatorOut,FirstName,LastName,Location,Purpose,CustType")] Order order)
        {
            if (ModelState.IsValid)
            {
                db.Entry(order).State = EntityState.Modified;
                await db.SaveChangesAsync();
                return RedirectToAction("Index");
            }
            return View(order);
        }

        // GET: Orders/Delete/5
        public async Task<ActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Order order = await db.Order.FindAsync(id);
            if (order == null)
            {
                return HttpNotFound();
            }
            return View(order);
        }

        // POST: Orders/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> DeleteConfirmed(int id)
        {
            Order order = await db.Order.FindAsync(id);
            db.Order.Remove(order);
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

    public static class IdentityInfo
    {
        public static string GetLastName(this System.Security.Principal.IPrincipal usr)
        {
            var lastNameClaim = ((ClaimsIdentity)usr.Identity).FindFirst("LastName");
            if (lastNameClaim != null)
                return lastNameClaim.Value;

            return "";
        }
    }
}
