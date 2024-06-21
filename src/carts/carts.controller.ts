import {
  Controller,
  Get,
  Param,
  Put,
  Delete,
  NotFoundException,
  BadRequestException,
  Post,
  Body,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger'; // Import Swagger decorators
import { CartsService } from './carts.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { RemoveFromCartDto } from './dto/remove-from-cart.dto';

@ApiTags('cart') // Set tags for Swagger UI
@Controller('api/cart')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Post('add')
  @ApiOperation({ summary: 'Add item to cart' })
  @ApiBody({ type: AddToCartDto }) // Document request body
  @ApiResponse({ status: 200, description: 'Item added successfully' }) // Document response
  async addToCart(@Body() addToCartDto: AddToCartDto): Promise<any> {
    try {
      return await this.cartsService.addToCart(addToCartDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      } else {
        throw new BadRequestException(
          `Failed to add item to cart: ${error.message}`,
        );
      }
    }
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get user cart' })
  @ApiParam({ name: 'userId', type: 'string', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User cart details' }) // Document response
  async getUserCart(@Param('userId') userId: string): Promise<any> {
    try {
      const parsedUserId = parseInt(userId, 10);
      return await this.cartsService.getUserCart(parsedUserId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      } else {
        throw new BadRequestException(
          `Failed to retrieve cart: ${error.message}`,
        );
      }
    }
  }

  @Put('update')
  @ApiOperation({ summary: 'Update item quantity in cart' })
  @ApiBody({ type: UpdateCartDto }) // Document request body
  @ApiResponse({ status: 200, description: 'Cart updated successfully' }) // Document response
  async updateCart(@Body() updateCartDto: UpdateCartDto): Promise<any> {
    try {
      return await this.cartsService.updateCart(updateCartDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      } else {
        throw new BadRequestException(
          `Failed to update cart: ${error.message}`,
        );
      }
    }
  }

  @Delete('remove')
  @ApiOperation({ summary: 'Remove item from cart' })
  @ApiBody({ type: RemoveFromCartDto }) // Document request body
  @ApiResponse({ status: 200, description: 'Item removed successfully' }) // Document response
  async removeFromCart(
    @Body() removeFromCartDto: RemoveFromCartDto,
  ): Promise<any> {
    try {
      return await this.cartsService.removeFromCart(removeFromCartDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      } else {
        throw new BadRequestException(
          `Failed to remove item from cart: ${error.message}`,
        );
      }
    }
  }
}
