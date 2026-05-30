using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using FinTrack.Api.Models;

namespace FinTrack.Api.Data;

public partial class AppDbContext : DbContext { //partial means u can declare more in different files -- inheret from dbContext
    
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) //! be back here DI
    {
    }
    public DbSet<User> Users { get; set; }
    public DbSet<Account> Accounts { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<Transaction> Transactions { get; set; }



protected override void OnModelCreating(ModelBuilder modelBuilder){
// Transaction → User
modelBuilder.Entity<Transaction>()
    .HasOne(t => t.User)
    .WithMany()
    .HasForeignKey(t => t.UserId);

// Account → User
modelBuilder.Entity<Account>()
    .HasOne(a => a.User)
    .WithMany()
    .HasForeignKey(a => a.UserId);

// Category → User
modelBuilder.Entity<Category>()
    .HasOne(c => c.User)
    .WithMany()
    .HasForeignKey(c => c.UserId);

// Account.Balance precision
modelBuilder.Entity<Account>()
    .Property(a => a.Balance)
    .HasPrecision(18, 2);

}
}