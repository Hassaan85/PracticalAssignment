

using System;
using System.Security.Cryptography;
using System.Text;
using API.Data;
using API.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

    public class AccountController(AppDbContext context) : BaseApiController
{
    [HttpPost("register")]
    public async Task<ActionResult<AppUser>>Register(RegisterDto registerDto)

    {
        if (await NameExists(registerDto.DisplayName)) return BadRequest("Name Taken");
        var hmac = new HMACSHA512();

        var user = new AppUser
        {
            DisplayName = registerDto.DisplayName,
            Email = registerDto.Email,
            PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.password)),
            PasswordSalt = hmac.Key
        };

        context.Users.Add(user);
        await context.SaveChangesAsync();

        return user;
    }

    [HttpPost("login")]
    public async Task<ActionResult<AppUser>>Login(LoginDto loginDto)
    {
        var user = await context.Users.SingleOrDefaultAsync(x => x.DisplayName== loginDto.Name);

        if (user == null) return Unauthorized("Invalid UserName");

        using var hmac = new HMACSHA512(user.PasswordSalt);

        var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));

        for (var i = 0; i < computedHash.Length; i++)
        {
            if (computedHash[i] != user.PasswordHash[i]) return BadRequest("Invalid Password");
        }
        return user;
    }

    private async Task<bool> NameExists(string DisplayName)

    {
        return await context.Users.AnyAsync(x => x.DisplayName.ToLower() == DisplayName.ToLower());
    }
}


