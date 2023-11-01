using LearningStarter.Common;
using LearningStarter.Data;
using LearningStarter.Entities;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Reflection.Emit;
using System.Security.Cryptography;

namespace LearningStarter.Controllers;
[ApiController]
[Route("api/payments")]

public class PaymentsController : ControllerBase
{
    private readonly DataContext _dataContext;
    public PaymentsController(DataContext dataContext)
    {
        _dataContext = dataContext;

    }

    [HttpGet]
    public IActionResult GetAll()
    {
        var response = new Response();

        var data = _dataContext
            .Set<Payment>()
            .Select(payment => new PaymentGetDto


            {
                Id = payment.Id,
                CardName = payment.CardName,
                CardNumber = payment.CardNumber,
                CardExpiry = payment.CardExpiry,
                CardCvv = payment.CardCvv,
                UserId = payment.UserId

            })
            .ToList();
        response.Data = data;
        return Ok(response);

    }

    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        var response = new Response();
        var data = _dataContext
            .Set<Payment>()
            .Select(payment => new PaymentGetDto
            {
                Id = payment.Id,
                CardName = payment.CardName,
                CardNumber = payment.CardNumber,
                CardExpiry = payment.CardExpiry,
                CardCvv = payment.CardCvv,
                UserId = payment.UserId
            })

            .FirstOrDefault(payment => payment.Id == id);


        response.Data = data;
        return Ok(response);


    }


    [HttpPost]
    public IActionResult Create([FromBody] PaymentCreateDto createDto)
    {
        var response = new Response();

        //if (createDto.CardNumber < 0)
        //{
        //    response.AddError(nameof(createDto.CardNumber), "Cardnumber must be valid ");
        //}

        //if (createDto.CardCvv < 0)
        //{
        //    response.AddError(nameof(createDto.CardCvv), "CardCvv  must be valid ");
        //}

        if (response.HasErrors)
        {
            return BadRequest(response);

        }

        //HashAlgorithm hash = SHA256.Create();
        //byte[] result = hash.ComputeHash((byte[]) createDto.CardCvv);

        var paymentToCreate = new Payment
        {
            CardName = createDto.CardName,
            CardNumber = createDto.CardNumber,
            CardExpiry = createDto.CardExpiry,
            CardCvv = createDto.CardCvv,
            UserId = createDto.UserId
        };
        _dataContext.Set<Payment>().Add(paymentToCreate);
        _dataContext.SaveChanges();

        var paymentToReturn = new PaymentGetDto
        {
            Id = paymentToCreate.Id,
            CardName = paymentToCreate.CardName,
            CardNumber = paymentToCreate.CardNumber,
            CardExpiry = paymentToCreate.CardExpiry,
            CardCvv = paymentToCreate.CardCvv,
            UserId = createDto.UserId


        };
        response.Data = paymentToReturn;
        return Created("", response);

    }
    [HttpPut("{id}")]
    public IActionResult Update([FromBody] PaymentUpdateDto updateDto, int id)
    {
        var response = new Response();

        //if (updateDto.CardNumber < 0)
        //{
        //    response.AddError(nameof(updateDto.CardNumber), "Cardnumber must be valid ");
        //}

        //if (updateDto.CardCvv < 0)
        //{
        //    response.AddError(nameof(updateDto.CardCvv), "CardCvv  must be valid ");
        //}




        var paymentToUpdate = _dataContext.Set<Payment>()
            .FirstOrDefault(payment => payment.Id == id);

        if (paymentToUpdate == null)
        {
            response.AddError("id", "Payment not found .");
        }
        if (response.HasErrors)
        {
            return BadRequest(response);
        }



        paymentToUpdate.CardName = updateDto.CardName;
        paymentToUpdate.CardNumber = updateDto.CardNumber;
        paymentToUpdate.CardExpiry = updateDto.CardExpiry;
        paymentToUpdate.CardCvv = updateDto.CardCvv;


        _dataContext.SaveChanges();

        var paymentToReturn = new PaymentGetDto
        {
            Id = paymentToUpdate.Id,
            CardName = paymentToUpdate.CardName,
            CardNumber = paymentToUpdate.CardNumber,
            CardExpiry = paymentToUpdate.CardExpiry,
            CardCvv = paymentToUpdate.CardCvv,



        };
        response.Data = paymentToReturn;
        return Ok(response);

    }
    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var response = new Response();

        var paymentToDelete = _dataContext.Set<Payment>()
            .FirstOrDefault(payment => payment.Id == id);

        if (paymentToDelete == null)
        {
            response.AddError("id", " Payment not found .");
        }
        if (response.HasErrors)
        {
            return BadRequest(response);
        }
        _dataContext.Set<Payment>().Remove(paymentToDelete);
        _dataContext.SaveChanges();

        response.Data = true;
        return Ok(response);

    }

}








