import React, { useState } from 'react';
import { apiAvaliativa } from '../lib/api';

type LogItem = {
  rota: string;
  status: number;
  resposta: any;
};

export const AvaliativaPage: React.FC = () => {
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const addLog = (rota: string, status: number, resposta: any) => {
    setLogs((prev) => [
      ...prev,
      {
        rota,
        status,
        resposta,
      },
    ]);
  };

  const testarRotas = async () => {
    setLoading(true);
    setErro('');
    setLogs([]);

    try {
      const stamp = Date.now();

      const emailHeitor = `heitor${stamp}@email.com`;
      const emailLuiz = `luiz${stamp}@email.com`;

      const usuario1 = await apiAvaliativa.post('/usuarios', {
        nome: 'Heitor',
        email: emailHeitor,
        senha: '123456',
        location: 'Taguatinga',
      });

      addLog('POST /usuarios - Heitor', usuario1.status, usuario1.data);

      const usuario2 = await apiAvaliativa.post('/usuarios', {
        nome: 'Luiz',
        email: emailLuiz,
        senha: '123456',
        location: 'Taguatinga',
      });

      addLog('POST /usuarios - Luiz', usuario2.status, usuario2.data);

      const login1 = await apiAvaliativa.post('/login', {
        email: emailHeitor,
        senha: '123456',
      });

      addLog('POST /login - Heitor', login1.status, login1.data);

      const login2 = await apiAvaliativa.post('/login', {
        email: emailLuiz,
        senha: '123456',
      });

      addLog('POST /login - Luiz', login2.status, login2.data);

      const tokenHeitor = login1.data.token;
      const tokenLuiz = login2.data.token;

      const livro1 = await apiAvaliativa.post(
        '/livros',
        {
          titulo: 'Dom Casmurro',
          autor: 'Machado de Assis',
          condicao: 'usado',
          description: 'Livro em bom estado',
        },
        {
          headers: {
            Authorization: `Bearer ${tokenHeitor}`,
          },
        }
      );

      addLog('POST /livros - Livro do Heitor', livro1.status, livro1.data);

      const livro2 = await apiAvaliativa.post(
        '/livros',
        {
          titulo: 'O Hobbit',
          autor: 'J. R. R. Tolkien',
          condicao: 'usado',
          description: 'Livro conservado',
        },
        {
          headers: {
            Authorization: `Bearer ${tokenLuiz}`,
          },
        }
      );

      addLog('POST /livros - Livro do Luiz', livro2.status, livro2.data);

      const livrosDisponiveis = await apiAvaliativa.get('/livros/disponiveis', {
        headers: {
          Authorization: `Bearer ${tokenHeitor}`,
        },
      });

      addLog(
        'GET /livros/disponiveis',
        livrosDisponiveis.status,
        livrosDisponiveis.data
      );

      const troca = await apiAvaliativa.post(
        '/trocas',
        {
          receptorId: usuario2.data.id,
          livrosOferecidosIds: [livro1.data.id],
          livrosSolicitadosIds: [livro2.data.id],
        },
        {
          headers: {
            Authorization: `Bearer ${tokenHeitor}`,
          },
        }
      );

      addLog('POST /trocas', troca.status, troca.data);

      const trocaAceita = await apiAvaliativa.post(
        `/trocas/${troca.data.id}/aceitar`,
        {},
        {
          headers: {
            Authorization: `Bearer ${tokenLuiz}`,
          },
        }
      );

      addLog('POST /trocas/:id/aceitar', trocaAceita.status, trocaAceita.data);
    } catch (error: any) {
      console.error(error);
      setErro(error.response?.data?.error || 'Erro ao testar rotas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '32px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Teste da API REST Avaliativa</h1>

      <p>
        Esta tela testa as rotas novas criadas em <strong>/api/avaliativa</strong>.
      </p>

      <button
        onClick={testarRotas}
        disabled={loading}
        style={{
          padding: '12px 20px',
          background: '#2563eb',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          marginBottom: '24px',
        }}
      >
        {loading ? 'Testando...' : 'Testar rotas'}
      </button>

      {erro && (
        <div
          style={{
            background: '#fee2e2',
            color: '#991b1b',
            padding: '12px',
            borderRadius: '6px',
            marginBottom: '16px',
          }}
        >
          {erro}
        </div>
      )}

      {logs.map((log, index) => (
        <div
          key={index}
          style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '16px',
            background: '#f9fafb',
          }}
        >
          <h3>{log.rota}</h3>

          <p>
            Status:{' '}
            <strong
              style={{
                color: log.status >= 200 && log.status < 300 ? 'green' : 'red',
              }}
            >
              {log.status}
            </strong>
          </p>

          <pre
            style={{
              background: '#111827',
              color: '#f9fafb',
              padding: '12px',
              borderRadius: '6px',
              overflowX: 'auto',
            }}
          >
            {JSON.stringify(log.resposta, null, 2)}
          </pre>
        </div>
      ))}
    </div>
  );
};