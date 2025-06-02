import { makeAutoObservable } from "mobx";

class CategoryStore {
  categories: string[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  setCategories(categories: string[]) {
    this.categories = categories;
  }

  addCategory(category: string) {
    if (!this.categories.includes(category)) {
      this.categories.push(category);
    }
  }

  removeCategory(category: string) {
    this.categories = this.categories.filter((cat) => cat !== category);
  }
}

const categoryStore = new CategoryStore();
export default categoryStore;
