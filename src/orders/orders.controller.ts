import {
  Controller,
  Post,
  Get,
  Put,
  Param,
  Body,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order.dto';

@ApiTags('orders')
@Controller('api/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiBody({ type: CreateOrderDto }) // Document request body
  @ApiResponse({ status: 201, description: 'Order created successfully' }) // Document response
  async createOrder(@Body() createOrderDto: CreateOrderDto): Promise<any> {
    try {
      return await this.ordersService.createOrder(createOrderDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      } else {
        throw new BadRequestException(
          `Failed to create order: ${error.message}`,
        );
      }
    }
  }

  @Get(':userId/:orderId')
  @ApiOperation({ summary: 'Get order details by user ID and order ID' })
  @ApiParam({ name: 'userId', type: 'string', description: 'User ID' })
  @ApiParam({ name: 'orderId', type: 'string', description: 'Order ID' })
  @ApiResponse({ status: 200, description: 'Order details' }) // Document response
  async getOrderById(
    @Param('userId') userId: string,
    @Param('orderId') orderId: string,
  ): Promise<any> {
    try {
      const parsedUserId = parseInt(userId, 10);
      const parsedOrderId = parseInt(orderId, 10);
      return await this.ordersService.getOrderByIdForUser(
        parsedUserId,
        parsedOrderId,
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else {
        throw new NotFoundException(
          `Failed to retrieve order: ${error.message}`,
        );
      }
    }
  }

  @Put(':orderId/status')
  @ApiOperation({ summary: 'Update the status of an order' })
  @ApiParam({ name: 'orderId', type: 'string', description: 'Order ID' })
  @ApiBody({ type: UpdateOrderStatusDto }) // Document request body
  @ApiResponse({
    status: 200,
    description: 'Order status updated successfully',
  }) // Document response
  async updateOrderStatus(
    @Param('orderId') orderId: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
    @Body('userId') userId: number,
  ): Promise<any> {
    try {
      const parsedOrderId = parseInt(orderId, 10);
      return await this.ordersService.updateOrderStatus(
        userId,
        parsedOrderId,
        updateOrderStatusDto,
      );
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      } else {
        throw new BadRequestException(
          `Failed to update order status: ${error.message}`,
        );
      }
    }
  }
}
