import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class IndexeddbService {
  private db: IDBDatabase | null = null;
  private dbReady: Promise<IDBDatabase>;

  constructor() {
    this.dbReady = this.initDB();
  }

  // Inicializando o banco de dados
  private initDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('ControleEstoqueDB', 1);

      request.onupgradeneeded = (event: any) => {
        const db = event.target.result;

        if (!db.objectStoreNames.contains('Estoque')) {
          const estoqueStore = db.createObjectStore('Estoque', { keyPath: 'id', autoIncrement: true });
          estoqueStore.createIndex('Nome', 'Nome', { unique: false });
        }

        if (!db.objectStoreNames.contains('Categorias')) {
          const categoriasStore = db.createObjectStore('Categorias', { keyPath: 'id', autoIncrement: true });
          categoriasStore.createIndex('Nome', 'Nome', { unique: false });
          categoriasStore.createIndex('Esto', 'Esto', { unique: false });
        }
        

        if (!db.objectStoreNames.contains('Historico')) {
          const historicoStore = db.createObjectStore('Historico', { keyPath: 'id', autoIncrement: true });
          historicoStore.createIndex('Data', 'Data', { unique: false });
          historicoStore.createIndex('Produto', 'Produto', { unique: false });
          historicoStore.createIndex('Acao', 'Acao', { unique: false });
          historicoStore.createIndex('Quantidade', 'Quantidade', { unique: false });
          historicoStore.createIndex('Esto', 'Esto', { unique: false });
        }

        if (!db.objectStoreNames.contains('Produto')) {
          const produtoStore = db.createObjectStore('Produto', { keyPath: 'id', autoIncrement: true });
          produtoStore.createIndex('CodigoBarras', 'CodigoBarras', { unique: true });
          produtoStore.createIndex('QuantidadeEstoque', 'QuantidadeEstoque', { unique: false });
          produtoStore.createIndex('DataValidade', 'DataValidade', { unique: false });
          produtoStore.createIndex('Categoria', 'Categoria', { unique: false });
          produtoStore.createIndex('Esto','Esto',{unique:false});
        }

        if (!db.objectStoreNames.contains('Login')) {
          const loginStore = db.createObjectStore('Login', { keyPath: 'id', autoIncrement: true });
          loginStore.createIndex('Email', 'Email', { unique: true });
        }

        console.log('Banco de dados criado/atualizado com sucesso.');
      };

      request.onsuccess = (event: any) => {
        const db = event.target.result as IDBDatabase; // Garantir que db seja do tipo IDBDatabase
        this.db = db;
        console.log('Banco de dados conectado com sucesso.');
        resolve(db); // Resolve com db que é do tipo correto
      };

      request.onerror = (event: any) => {
        console.error('Erro ao conectar ao banco de dados:', event);
        reject(event);
      };
    });
  }

  // Método para garantir que o banco de dados foi inicializado antes de qualquer operação
  private async getDB(): Promise<IDBDatabase> {
    return this.dbReady; // Retorna a promise de inicialização do banco de dados
  }

  // Método para adicionar dados a uma tabela (object store)
  async addData(storeName: string, data: any): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      store.add(data);

      transaction.oncomplete = () => {
        console.log('Dado adicionado com sucesso!');
        resolve();
      };

      transaction.onerror = (event: any) => {
        console.error('Erro ao adicionar dado:', event);
        reject(event);
      };
    });
  }

  // Método para buscar todos os dados de uma tabela
  getAllData(storeName: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        console.error('Banco de dados não inicializado');
        reject('Banco de dados não inicializado');
        return;
      }

      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = (event: any) => {
        console.error('Erro ao buscar dados:', event);
        reject(event);
      };
    });
  }

  // Método para buscar uma categoria pelo nome
  getCategoryByName(categoryName: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        console.error('Banco de dados não inicializado');
        reject('Banco de dados não inicializado');
        return;
      }

      const transaction = this.db.transaction(['Categorias'], 'readonly');
      const store = transaction.objectStore('Categorias');
      const index = store.index('Nome');
      const request = index.get(categoryName);

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = (event: any) => {
        console.error('Erro ao buscar categoria:', event);
        reject(event);
      };
    });
  }

  // Método para atualizar um registro
  updateData(storeName: string, data: any): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        console.error('Banco de dados não inicializado');
        reject('Banco de dados não inicializado');
        return;
      }
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      store.put(data);

      transaction.oncomplete = () => {
        console.log('Dado atualizado com sucesso!');
        resolve();
      };

      transaction.onerror = (event: any) => {
        console.error('Erro ao atualizar dado:', event);
        reject(event);
      };
    });
  }

  // Método para deletar um registro
  deleteData(storeName: string, id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        console.error('Banco de dados não inicializado');
        reject('Banco de dados não inicializado');
        return;
      }
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      store.delete(id);

      transaction.oncomplete = () => {
        console.log('Dado deletado com sucesso!');
        resolve();
      };

      transaction.onerror = (event: any) => {
        console.error('Erro ao deletar dado:', event);
        reject(event);
      };
    });
  }
}