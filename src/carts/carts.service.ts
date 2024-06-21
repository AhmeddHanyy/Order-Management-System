// carts.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { RemoveFromCartDto } from './dto/remove-from-cart.dto';

@Injectable()
export class CartsService {
  constructor(private readonly prisma: PrismaService) {}

  async addToCart(addToCartDto: AddToCartDto): Promise<any> {
    const { userId, productId, quantity } = addToCartDto;

    try {
      return await this.prisma.$transaction(async (prisma) => {
        const user = await prisma.user.findUnique({
          where: { userId },
        });

        if (!user) {
          throw new NotFoundException('User not found');
        }

        let cart = await prisma.cart.findFirst({
          where: { userId },
          orderBy: { cartId: 'desc' },
          include: { items: true },
        });

        if (!cart) {
          // Create a new cart
          cart = await prisma.cart.create({
            data: {
              userId,
              items: {
                create: [],
              },
            },
            include: { items: true },
          });
        }
        let cartItem = cart.items.find((item) => item.productId === productId);

        if (cartItem) {
          cartItem = await prisma.cartItem.update({
            where: { id: cartItem.id },
            data: { quantity: cartItem.quantity + quantity },
          });
        } else {
          cartItem = await prisma.cartItem.create({
            data: {
              cartId: cart.cartId,
              productId,
              quantity,
            },
          });
        }

        return {
          message: 'Item added to cart successfully',
          cartItem,
        };
      });
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

  async getUserCart(userId: number): Promise<any> {
    try {
      return await this.prisma.$transaction(async (prisma) => {
        // Check if user exists
        const user = await prisma.user.findUnique({
          where: { userId },
        });

        if (!user) {
          throw new NotFoundException('User not found');
        }

        // Retrieve user's cart
        const cart = await prisma.cart.findFirst({
          where: { userId },
          orderBy: { cartId: 'desc' },
          include: { items: true },
        });

        if (!cart) {
          throw new NotFoundException('Cart not found for user');
        }

        return cart;
      });
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

  async updateCart(updateCartDto: UpdateCartDto): Promise<any> {
    const { userId, productId, quantity } = updateCartDto;

    try {
      return await this.prisma.$transaction(async (prisma) => {
        // Check if user exists
        const user = await prisma.user.findUnique({
          where: { userId },
        });

        if (!user) {
          throw new NotFoundException('User not found');
        }

        // Retrieve user's cart
        const cart = await prisma.cart.findFirst({
          where: { userId },
          orderBy: { cartId: 'desc' },
          include: { items: true },
        });

        if (!cart) {
          throw new NotFoundException('Cart not found for user');
        }

        // Check if item exists in cart
        let cartItem = cart.items.find((item) => item.productId === productId);

        if (!cartItem) {
          throw new NotFoundException('Product not found in cart');
        }

        // Update quantity
        cartItem = await prisma.cartItem.update({
          where: { id: cartItem.id },
          data: { quantity },
        });

        return {
          message: 'Cart item updated successfully',
          cartItem,
        };
      });
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

  async removeFromCart(removeFromCartDto: RemoveFromCartDto): Promise<any> {
    const { userId, productId } = removeFromCartDto;

    try {
      return await this.prisma.$transaction(async (prisma) => {
        // Check if user exists
        const user = await prisma.user.findUnique({
          where: { userId },
        });

        if (!user) {
          throw new NotFoundException('User not found');
        }

        // Retrieve user's cart
        const cart = await prisma.cart.findFirst({
          where: { userId },
          orderBy: { cartId: 'desc' },
          include: { items: true },
        });

        if (!cart) {
          throw new NotFoundException('Cart not found for user');
        }

        // Check if item exists in cart
        const cartItem = cart.items.find(
          (item) => item.productId === productId,
        );

        if (!cartItem) {
          throw new NotFoundException('Product not found in cart');
        }

        // Remove item from cart
        await prisma.cartItem.delete({
          where: { id: cartItem.id },
        });

        return {
          message: 'Cart item removed successfully',
        };
      });
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
