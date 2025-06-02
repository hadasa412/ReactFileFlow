export interface Category {
    id: number;
    name: string;
  }
  
  export interface Document {
    id: number;
    fileName: string;
    categoryId: number;
    uploadDate: string;
  }
  

  