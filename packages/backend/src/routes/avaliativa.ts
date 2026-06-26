import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { generateToken } from '../utils/jwt';
import { AuthRequest, authenticate } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

function extrairIdsDosLivros(valor: unknown): string[] {
  if (!Array.isArray(valor)) {
    return [];
  }

  return valor
    .map((item) => {
      if (typeof item === 'string') {
        return item;
      }

      if (item && typeof item === 'object' && 'id' in item) {
        return String((item as any).id);
      }

      return null;
    })
    .filter((id): id is string => typeof id === 'string' && id.length > 0);
}


router.post('/usuarios', async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, nome, email, password, senha, location } = req.body;

    const finalName = name || nome;
    const finalPassword = password || senha;
    const finalLocation = location || 'Taguatinga';

    if (!finalName || !email || !finalPassword) {
      return res.status(400).json({
        error: 'Nome, email e senha são obrigatórios',
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({
        error: 'E-mail já cadastrado',
      });
    }

    const passwordHash = await bcrypt.hash(finalPassword, 10);

    const user = await prisma.user.create({
      data: {
        name: finalName,
        email,
        passwordHash,
        location: finalLocation,
      },
      select: {
        id: true,
        name: true,
        email: true,
        location: true,
        createdAt: true,
      },
    });

    return res.status(201).json(user);
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    return res.status(500).json({
      error: 'Erro ao criar usuário',
    });
  }
});


router.post('/login', async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password, senha } = req.body;
    const finalPassword = password || senha;

    if (!email || !finalPassword) {
      return res.status(400).json({
        error: 'Email e senha são obrigatórios',
      });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        error: 'Credenciais inválidas',
      });
    }

    const validPassword = await bcrypt.compare(finalPassword, user.passwordHash);

    if (!validPassword) {
      return res.status(401).json({
        error: 'Credenciais inválidas',
      });
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
    });

    return res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        location: user.location,
      },
      token,
    });
  } catch (error) {
    console.error('Erro no login:', error);
    return res.status(500).json({
      error: 'Erro no login',
    });
  }
});


router.get(
  '/usuarios/:id',
  authenticate,
  async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      const { id } = req.params;

      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          email: true,
          location: true,
          biography: true,
          profilePictureUrl: true,
          createdAt: true,
          books: {
            select: {
              id: true,
              title: true,
              author: true,
              listType: true,
              isAvailable: true,
            },
          },
        },
      });

      if (!user) {
        return res.status(404).json({
          error: 'Usuário não encontrado',
        });
      }

      return res.json(user);
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      return res.status(500).json({
        error: 'Erro ao buscar usuário',
      });
    }
  }
);


router.post(
  '/livros',
  authenticate,
  async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      const userId = req.user!.userId;
      const { title, titulo, author, autor, condition, condicao, description } = req.body;

      const finalTitle = title || titulo;
      const finalAuthor = author || autor;
      const finalCondition = condition || condicao || 'usado';

      if (!finalTitle || !finalAuthor) {
        return res.status(400).json({
          error: 'Título e autor são obrigatórios',
        });
      }

      const book = await prisma.book.create({
        data: {
          userId,
          title: finalTitle,
          author: finalAuthor,
          condition: finalCondition,
          description: description || null,
          photoUrls: [],
          isAvailable: true,
          listType: 'inventory',
        },
      });

      return res.status(201).json(book);
    } catch (error) {
      console.error('Erro ao cadastrar livro:', error);
      return res.status(500).json({
        error: 'Erro ao cadastrar livro',
      });
    }
  }
);


router.get(
  '/livros/disponiveis',
  authenticate,
  async (_req: AuthRequest, res: Response): Promise<any> => {
    try {
      const books = await prisma.book.findMany({
        where: {
          listType: 'inventory',
          isAvailable: true,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              location: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return res.json(books);
    } catch (error) {
      console.error('Erro ao listar livros:', error);
      return res.status(500).json({
        error: 'Erro ao listar livros disponíveis',
      });
    }
  }
);

router.post(
  '/trocas',
  authenticate,
  async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      const proposerId = req.user!.userId;
      const {
        receptorId,
        livrosOferecidosIds,
        livrosSolicitadosIds,
      } = req.body;

      if (
        !receptorId ||
        !Array.isArray(livrosOferecidosIds) ||
        !Array.isArray(livrosSolicitadosIds) ||
        livrosOferecidosIds.length === 0 ||
        livrosSolicitadosIds.length === 0
      ) {
        return res.status(400).json({
          error:
            'Informe receptorId, livrosOferecidosIds e livrosSolicitadosIds',
        });
      }

      if (receptorId === proposerId) {
        return res.status(400).json({
          error: 'O usuário não pode propor troca com ele mesmo',
        });
      }

      const livrosOferecidos = await prisma.book.findMany({
        where: {
          id: { in: livrosOferecidosIds },
          userId: proposerId,
          listType: 'inventory',
          isAvailable: true,
        },
      });

      const livrosSolicitados = await prisma.book.findMany({
        where: {
          id: { in: livrosSolicitadosIds },
          userId: receptorId,
          listType: 'inventory',
          isAvailable: true,
        },
      });

      if (livrosOferecidos.length !== livrosOferecidosIds.length) {
        return res.status(400).json({
          error: 'Um ou mais livros oferecidos são inválidos',
        });
      }

      if (livrosSolicitados.length !== livrosSolicitadosIds.length) {
        return res.status(400).json({
          error: 'Um ou mais livros solicitados são inválidos',
        });
      }

      const trade = await prisma.$transaction(async (tx) => {
        let chat = await tx.chat.findFirst({
          where: {
            OR: [
              {
                participant1Id: proposerId,
                participant2Id: receptorId,
              },
              {
                participant1Id: receptorId,
                participant2Id: proposerId,
              },
            ],
          },
        });

        if (!chat) {
          chat = await tx.chat.create({
            data: {
              participant1Id: proposerId,
              participant2Id: receptorId,
            },
          });
        }

        const novaTroca = await tx.trade.create({
          data: {
            participant1Id: proposerId,
            participant2Id: receptorId,
            proposerId,
            chatId: chat.id,
            status: 'pending',


            booksOffered: livrosOferecidosIds,
            booksRequested: livrosSolicitadosIds,
          },
        });

        await tx.book.updateMany({
          where: {
            id: {
              in: [...livrosOferecidosIds, ...livrosSolicitadosIds],
            },
          },
          data: {
            isAvailable: false,
          },
        });

        return novaTroca;
      });

      return res.status(201).json(trade);
    } catch (error) {
      console.error('Erro ao criar troca:', error);
      return res.status(500).json({
        error: 'Erro ao criar proposta de troca',
      });
    }
  }
);


router.post(
  '/trocas/:id/aceitar',
  authenticate,
  async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      const userId = req.user!.userId;
      const { id } = req.params;

      const trade = await prisma.trade.findUnique({
        where: { id },
      });

      if (!trade) {
        return res.status(404).json({
          error: 'Troca não encontrada',
        });
      }

      if (trade.status !== 'pending') {
        return res.status(400).json({
          error: 'A troca não está pendente. Crie uma nova proposta para testar.',
          statusAtual: trade.status,
        });
      }

      if (trade.proposerId === userId) {
        return res.status(403).json({
          error:
            'O usuário que criou a proposta não pode aceitar a própria troca. Entre com o outro usuário.',
        });
      }

      if (trade.participant1Id !== userId && trade.participant2Id !== userId) {
        return res.status(403).json({
          error: 'Usuário não participa desta troca',
        });
      }

      const proponenteId = trade.proposerId;
      const receptorId = userId;

      const livrosOferecidosIds = extrairIdsDosLivros(trade.booksOffered);
      const livrosSolicitadosIds = extrairIdsDosLivros(trade.booksRequested);

      if (livrosOferecidosIds.length === 0 || livrosSolicitadosIds.length === 0) {
        return res.status(400).json({
          error: 'A troca não possui livros válidos para transferência',
          booksOffered: trade.booksOffered,
          booksRequested: trade.booksRequested,
        });
      }

      const livrosOferecidos = await prisma.book.findMany({
        where: {
          id: {
            in: livrosOferecidosIds,
          },
        },
        select: {
          id: true,
          userId: true,
        },
      });

      const livrosSolicitados = await prisma.book.findMany({
        where: {
          id: {
            in: livrosSolicitadosIds,
          },
        },
        select: {
          id: true,
          userId: true,
        },
      });

      if (livrosOferecidos.length !== livrosOferecidosIds.length) {
        return res.status(400).json({
          error: 'Um ou mais livros oferecidos não existem mais',
        });
      }

      if (livrosSolicitados.length !== livrosSolicitadosIds.length) {
        return res.status(400).json({
          error: 'Um ou mais livros solicitados não existem mais',
        });
      }

      const livroOferecidoComDonoErrado = livrosOferecidos.find(
        (livro) => livro.userId !== proponenteId
      );

      if (livroOferecidoComDonoErrado) {
        return res.status(400).json({
          error: 'Um ou mais livros oferecidos não pertencem mais ao proponente',
          livroId: livroOferecidoComDonoErrado.id,
        });
      }

      const livroSolicitadoComDonoErrado = livrosSolicitados.find(
        (livro) => livro.userId !== receptorId
      );

      if (livroSolicitadoComDonoErrado) {
        return res.status(400).json({
          error: 'Um ou mais livros solicitados não pertencem mais ao receptor',
          livroId: livroSolicitadoComDonoErrado.id,
        });
      }

      const resultado = await prisma.$transaction(async (tx) => {
        await tx.book.updateMany({
          where: {
            id: {
              in: livrosOferecidosIds,
            },
          },
          data: {
            userId: receptorId,
            isAvailable: true,
            listType: 'inventory',
          },
        });

        await tx.book.updateMany({
          where: {
            id: {
              in: livrosSolicitadosIds,
            },
          },
          data: {
            userId: proponenteId,
            isAvailable: true,
            listType: 'inventory',
          },
        });

        const updatedTrade = await tx.trade.update({
          where: { id },
          data: {
            status: 'accepted',
            completedAt: new Date(),
          },
        });

        return updatedTrade;
      });

      return res.json({
        message: 'Troca aceita e livros transferidos com sucesso',
        trade: resultado,
        livrosTransferidos: {
          paraProponente: livrosSolicitadosIds,
          paraReceptor: livrosOferecidosIds,
        },
      });
    } catch (error: any) {
      console.error('Erro ao aceitar troca:', error);

      return res.status(500).json({
        error: 'Erro ao aceitar troca',
        details: error.message,
      });
    }
  }
);

export default router;
