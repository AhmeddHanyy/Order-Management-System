// orders.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async createOrder(createOrderDto: CreateOrderDto): Promise<any> {
    const { userId } = createOrderDto;

    try {
      return await this.prisma.$transaction(async (prisma) => {
        // Check if user exists
        const user = await prisma.user.findUnique({
          where: { userId },
        });

        if (!user) {
          throw new NotFoundException('User not found');
        }

        // Retrieve user's latest cart with items
        const cart = await prisma.cart.findFirst({
          where: { userId },
          orderBy: { cartId: 'desc' },
          include: {
            items: {
              include: {
                product: true,
              },
            },
          },
        });

        if (!cart) {
          throw new NotFoundException('Cart not found for user');
        }

        // Check if user has items in their cart
        if (!cart.items || cart.items.length === 0) {
          throw new BadRequestException("No items found in the user's cart");
        }

        // Create a new order
        const newOrder = await prisma.order.create({
          data: {
            userId: user.userId,
            status: 'Pending',
            items: {
              createMany: {
                data: cart.items.map((item) => ({
                  productId: item.productId,
                  quantity: item.quantity,
                  price: item.product.price,
                })),
              },
            },
          },
          include: { items: true }, // Include order items in response
        });

        // Clear the user's cart after order creation
        await prisma.cartItem.deleteMany({
          where: { cartId: cart.cartId },
        });

        // Delete the cart itself as no longer needed
        await prisma.cart.delete({
          where: { cartId: cart.cartId },
        });

        return {
          message: 'Order created successfully',
          order: newOrder,
        };
      });
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error; // Rethrow known exceptions
      } else {
        throw new BadRequestException(
          `Failed to create order: ${error.message}`,
        );
      }
    }
  }

  async getOrderById(orderId: number): Promise<any> {
    const order = await this.prisma.order.findUnique({
      where: { orderId },
      include: { items: true }, // Include order items if needed
    });
    return order;
  }

  async getOrderByIdForUser(userId: number, orderId: number): Promise<any> {
    try {
      // Check if user exists
      const user = await this.prisma.user.findUnique({
        where: { userId },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Retrieve order by orderId and userId
      const order = await this.prisma.order.findUnique({
        where: { orderId },
        include: { items: true }, // Include order items if needed
      });

      if (!order || order.userId !== userId) {
        throw new NotFoundException('Order not found for the user');
      }

      return order;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new NotFoundException(
          `Failed to retrieve order: ${error.message}`,
        );
      }
    }
  }

  async updateOrderStatus(
    userId: number,
    orderId: number,
    updateOrderStatusDto: UpdateOrderStatusDto,
  ): Promise<any> {
    try {
      const { status } = updateOrderStatusDto;

      // Check if user exists
      const user = await this.prisma.user.findUnique({
        where: { userId },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Check if the user has the specified order
      const order = await this.prisma.order.findFirst({
        where: {
          orderId,
          userId,
        },
      });

      if (!order) {
        throw new NotFoundException('Order not found for user');
      }

      // Update the order status
      await this.prisma.order.update({
        where: { orderId },
        data: { status },
      });

      return {
        message: 'Order status updated successfully',
        orderId,
        newStatus: status,
      };
    } catch (error) {
      throw error; // Rethrow to be handled by the controller
    }
  }
}
