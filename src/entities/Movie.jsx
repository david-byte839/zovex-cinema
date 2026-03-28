const STORAGE_KEY = 'zovex_movies';

function getAll() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch { return []; }
}

function saveAll(movies) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(movies));
}

export const Movie = {
  list: async (sortField = '-created_date', limit = 15000) => {
    const movies = getAll();
    return movies.slice(0, limit);
  },

  create: async (data) => {
    const movies = getAll();
    const newMovie = {
      ...data,
      id: Date.now().toString(),
      created_date: new Date().toISOString(),
    };
    movies.push(newMovie);
    saveAll(movies);
    return newMovie;
  },

  update: async (id, data) => {
    const movies = getAll();
    const idx = movies.findIndex(m => m.id === id);
    if (idx !== -1) {
      movies[idx] = { ...movies[idx], ...data };
      saveAll(movies);
      return movies[idx];
    }
    throw new Error('Movie not found');
  },

  delete: async (id) => {
    const movies = getAll();
    saveAll(movies.filter(m => m.id !== id));
  },

  uploadFile: async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve({ file_url: e.target.result });
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },
};
