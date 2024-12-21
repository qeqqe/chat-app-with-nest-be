import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

@Injectable()
export class ChatService {
  async saveMessage(message: Prisma.MessagesCreateInput) {
    return await prisma.messages.create({
      data: message,
    });
  }

  async getMessages(userId: string, receiverId: string) {
    return await prisma.messages.findMany({
      where: {
        OR: [
          { userId, receiverId },
          { userId: receiverId, receiverId: userId },
        ],
      },
      orderBy: {
        createdAt: 'asc',
      },
      include: {
        sender: {
          select: {
            username: true,
          },
        },
      },
    });
  }
}
