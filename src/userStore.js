import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";

const useUserStore = create((set) => ({
  users: [],
  setUsers: (users) => set({ users }),

  fetchUsers: async () => {
    try {
      const res = await fetch("https://jsonplaceholder.typicode.com/users");
      const data = await res.json();
      const simplified = data.map((user) => ({
        id: user.id.toString(),
        name: user.name,
        email: user.email,
        phone: user.phone,
      }));
      set({ users: simplified });
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  },

  createUser: (formData) =>
    set((state) => ({
      users: [...state.users, { id: uuidv4(), ...formData }],
    })),

  updateUser: (id, formData) =>
    set((state) => ({
      users: state.users.map((user) =>
        user.id === id ? { ...user, ...formData } : user
      ),
    })),

  deleteUser: (id) =>
    set((state) => ({
      users: state.users.filter((user) => user.id !== id),
    })),
}));

export default useUserStore;
