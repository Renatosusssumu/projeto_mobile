import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IndexeddbService {
  private db: IDBDatabase | null = null;

  constructor() {
    this.initDB();
  }

  // Inicializando o banco de dados e criando as "tabelas" (object stores)
  initDB() {
    const request = indexedDB.open('ControleEstoqueDB', 1);

    request.onupgradeneeded = (event: any) => {
      this.db = event.target.result;

      // Criar object stores (equivalente às tabelas)
      if (!this.db.objectStoreNames.contains('Estoque')) {
        const estoqueStore = this.db.createObjectStore('Estoque', { keyPath: 'id', autoIncrement: true });
        estoqueStore.createIndex('Nome', 'Nome', { unique: false });
      }

      if (!this.db.objectStoreNames.contains('Categorias')) {
        const categoriasStore = this.db.createObjectStore('Categorias', { keyPath: 'id', autoIncrement: true });
        categoriasStore.createIndex('Nome', 'Nome', { unique: false });
      }

      if (!this.db.objectStoreNames.contains('Historico')) {
        const historicoStore = this.db.createObjectStore('Historico', { keyPath: 'id', autoIncrement: true });
        historicoStore.createIndex('Data', 'Data', { unique: false });
        historicoStore.createIndex('Produto', 'Produto', { unique: false });
        historicoStore.createIndex('Acao', 'Acao', { unique: false });
      }

      if (!this.db.objectStoreNames.contains('Produto')) {
        const produtoStore = this.db.createObjectStore('Produto', { keyPath: 'id', autoIncrement: true });
        produtoStore.createIndex('CodigoBarras', 'CodigoBarras', { unique: true });
        produtoStore.createIndex('QuantidadeEstoque', 'QuantidadeEstoque', { unique: false });
        produtoStore.createIndex('Categoria', 'Categoria', { unique: false });
      }

      if (!this.db.objectStoreNames.contains('Login')) {
        const loginStore = this.db.createObjectStore('Login', { keyPath: 'id', autoIncrement: true });
        loginStore.createIndex('Email', 'Email', { unique: true });
      }

      console.log('Banco de dados criado/atualizado com sucesso.');
    };

    request.onsuccess = (event: any) => {
      this.db = event.target.result;
      console.log('Banco de dados conectado com sucesso.');
    };

    request.onerror = (event: any) => {
      console.error('Erro ao conectar ao banco de dados:', event);
    };
  }

  // Método para adicionar dados a uma tabela (object store)
  addData(storeName: string, data: any): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        console.error('Banco de dados não inicializado');
        reject('Banco de dados não inicializado');
        return;
      }
      const transaction = this.db.transaction([storeName], 'readwrite');
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
